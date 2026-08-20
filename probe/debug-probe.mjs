// Mimics what vscode-js-debug does: discover node inspector targets, enable the
// debugger, consume source maps and try to bind a breakpoint on a real source file.
import WebSocket from 'ws';
import { SourceMapConsumer } from 'source-map';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const targetFile = path.resolve(process.argv[2]); // source file to break in
const targetLine = Number(process.argv[3]); // 1-based line in source
const portsArg = process.argv[4] || '9229-9240';
const hitUrl = process.argv[5];

const [pStart, pEnd] = portsArg.split('-').map(Number);

async function listTargets() {
  const out = [];
  for (let p = pStart; p <= (pEnd || pStart); p++) {
    try {
      const r = await fetch(`http://127.0.0.1:${p}/json/list`, { signal: AbortSignal.timeout(1500) });
      const j = await r.json();
      for (const t of j) out.push({ port: p, ...t });
    } catch {}
  }
  return out;
}

function readSourceMap(scriptUrl, sourceMapURL) {
  try {
    if (sourceMapURL.startsWith('data:')) {
      const b64 = sourceMapURL.slice(sourceMapURL.indexOf(',') + 1);
      const isB64 = /;base64,/.test(sourceMapURL);
      return JSON.parse(isB64 ? Buffer.from(b64, 'base64').toString('utf8') : decodeURIComponent(b64));
    }
    let mapPath;
    if (sourceMapURL.startsWith('file://')) mapPath = url.fileURLToPath(sourceMapURL);
    else if (path.isAbsolute(sourceMapURL)) mapPath = sourceMapURL;
    else {
      const base = scriptUrl.startsWith('file://') ? path.dirname(url.fileURLToPath(scriptUrl)) : path.dirname(scriptUrl);
      mapPath = path.resolve(base, decodeURIComponent(sourceMapURL));
    }
    return JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  } catch (e) {
    return { __error: String(e) };
  }
}

class Session {
  constructor(t) {
    this.t = t;
    this.id = 0;
    this.pending = new Map();
    this.ws = new WebSocket(t.webSocketDebuggerUrl, { maxPayload: 512 * 1024 * 1024 });
    this.scripts = new Map();
    this.paused = [];
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, [res, rej]);
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  async start(onScript, onPaused) {
    await new Promise((res, rej) => {
      this.ws.once('open', res);
      this.ws.once('error', rej);
    });
    this.ws.on('message', (d) => {
      const msg = JSON.parse(d.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const [res, rej] = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
        return;
      }
      if (msg.method === 'Debugger.scriptParsed') onScript(this, msg.params, msg.sessionId);
      if (msg.method === 'Debugger.paused') onPaused(this, msg.params, msg.sessionId);
      if (msg.method === 'Target.attachedToTarget') {
        const sid = msg.params.sessionId;
        this.send('Debugger.enable', {}, sid).catch(() => {});
        this.send('Runtime.runIfWaitingForDebugger', {}, sid).catch(() => {});
      }
    });
    await this.send('Debugger.enable');
    // auto-attach to workers/child targets, like js-debug does
    await this.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }).catch(() => {});
  }
}

const bound = [];
const mapReports = [];
const sessions = [];

async function handleScript(sess, p, sessionId) {
  if (!p.sourceMapURL) return;
  const map = readSourceMap(p.url, p.sourceMapURL);
  if (!map || map.__error) return;
  const sources = (map.sections ? map.sections.flatMap((s) => (s.map && s.map.sources) || []) : map.sources) || [];
  const match = sources.findIndex((s) => {
    if (!s) return false;
    let abs = s;
    if (s.startsWith('file://')) { try { abs = url.fileURLToPath(s); } catch {} }
    return path.resolve(abs) === targetFile;
  });
  const looksLikeOurFile = sources.some((s) => s && s.includes(path.basename(targetFile)));
  if (looksLikeOurFile) {
    mapReports.push({ script: p.url.slice(0, 140), sourceRoot: map.sourceRoot, sources: sources.filter((s) => s && s.includes(path.basename(targetFile))).slice(0, 4), resolvedOnDisk: match !== -1 });
  }
  if (match === -1) return;
  const consumer = await new SourceMapConsumer(map);
  const src = sources[match];
  let gen = consumer.generatedPositionFor({ source: src, line: targetLine, column: 0, bias: SourceMapConsumer.LEAST_UPPER_BOUND });
  consumer.destroy();
  if (gen.line == null) { mapReports.push({ script: p.url.slice(0, 140), note: 'no generated position for line ' + targetLine }); return; }
  try {
    const res = await sess.send('Debugger.setBreakpoint', { location: { scriptId: p.scriptId, lineNumber: gen.line - 1, columnNumber: gen.column || 0 } }, sessionId);
    bound.push({ script: p.url.slice(0, 140), source: src, generated: gen, breakpointId: res.breakpointId, actual: res.actualLocation });
    console.log('BOUND breakpoint', JSON.stringify(bound.at(-1)));
  } catch (e) {
    console.log('FAILED to set breakpoint on', p.url.slice(0, 120), String(e).slice(0, 200));
  }
}

let pausedCount = 0;
function handlePaused(sess, p, sessionId) {
  pausedCount++;
  console.log('PAUSED reason=%s top=%s', p.reason, JSON.stringify(p.callFrames?.[0]?.location));
  sess.send('Debugger.resume', {}, sessionId).catch(() => {});
}

const targets = await listTargets();
console.log('inspector targets discovered:', JSON.stringify(targets.map((t) => ({ port: t.port, title: t.title, url: t.url })), null, 1));
for (const t of targets) {
  if (!t.webSocketDebuggerUrl) continue;
  const s = new Session(t);
  try {
    await s.start(handleScript, handlePaused);
    sessions.push(s);
  } catch (e) {
    console.log('attach failed', t.port, String(e).slice(0, 120));
  }
}

// give scripts time to parse, then trigger a request
await new Promise((r) => setTimeout(r, 3000));
if (hitUrl) {
  console.log('--- requesting', hitUrl);
  try {
    const r = await fetch(hitUrl, { signal: AbortSignal.timeout(20000) });
    console.log('response status', r.status, 'bytes', (await r.text()).length);
  } catch (e) {
    console.log('request error (may mean debugger paused/timeout):', String(e).slice(0, 200));
  }
  await new Promise((r) => setTimeout(r, 4000));
  // re-scan for late-appearing targets (child processes)
  const later = await listTargets();
  console.log('targets after request:', JSON.stringify(later.map((t) => ({ port: t.port, title: t.title, url: t.url }))));
  for (const t of later) {
    if (!t.webSocketDebuggerUrl || sessions.some((s) => s.t.id === t.id)) continue;
    const s = new Session(t);
    try { await s.start(handleScript, handlePaused); sessions.push(s); console.log('late attach', t.port, t.title); } catch {}
  }
  await new Promise((r) => setTimeout(r, 2000));
  if (bound.length) {
    console.log('--- second request to test bound breakpoints');
    try { const r = await fetch(hitUrl, { signal: AbortSignal.timeout(8000) }); console.log('response2 status', r.status); }
    catch (e) { console.log('request2 error:', String(e).slice(0, 200)); }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

console.log('=== RESULT ===');
console.log('target source file:', targetFile, 'line', targetLine);
console.log('source maps mentioning file:', JSON.stringify(mapReports, null, 1));
console.log('breakpoints bound:', bound.length);
console.log('debugger paused events:', pausedCount);
process.exit(0);
