// Headless harness that drives the real VSCode JavaScript debugger (vscode-js-debug)
// over DAP against `next dev`, so vercel/next.js#56702 can be verified without a GUI.
//
//   node scripts/vscode-debug-check.mjs [url] [file] [lines]
//   defaults: http://localhost:3010 app/page.tsx 5,7
//
// Set CHROME=/path/to/chrome if Chrome/Chromium is not found automatically.
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';

const JS_DEBUG_VERSION = '1.117.0';
const CWD = process.cwd();
const URL_ = process.argv[2] || 'http://localhost:3010';
const BP_FILE = path.resolve(CWD, process.argv[3] || 'app/page.tsx');
const BP_LINES = (process.argv[4] || '5,7').split(',').map(Number);
const PORT = 8200 + (process.pid % 500);
const USER_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-profile-'));

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const candidates = [
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  const pw = path.join(os.homedir(), '.cache/ms-playwright');
  if (fs.existsSync(pw)) {
    for (const dir of fs.readdirSync(pw).filter(d => d.startsWith('chromium-'))) {
      candidates.push(
        path.join(pw, dir, 'chrome-linux64/chrome'),
        path.join(pw, dir, 'chrome-linux/chrome'),
      );
    }
  }
  const found = candidates.find(p => fs.existsSync(p));
  if (!found) throw new Error('Chrome not found; set CHROME=/path/to/chrome');
  return found;
}
const CHROME = findChrome();

// download the standalone js-debug DAP server (same adapter VSCode ships)
const JS_DEBUG_DIR = path.join(os.tmpdir(), `js-debug-${JS_DEBUG_VERSION}`);
const DAP_ENTRY = path.join(JS_DEBUG_DIR, 'js-debug/src/dapDebugServer.js');
if (!fs.existsSync(DAP_ENTRY)) {
  fs.mkdirSync(JS_DEBUG_DIR, { recursive: true });
  const url = `https://github.com/microsoft/vscode-js-debug/releases/download/v${JS_DEBUG_VERSION}/js-debug-dap-v${JS_DEBUG_VERSION}.tar.gz`;
  const tgz = path.join(JS_DEBUG_DIR, 'js-debug.tar.gz');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  await pipeline(res.body, fs.createWriteStream(tgz));
  execFileSync('tar', ['xzf', tgz, '-C', JS_DEBUG_DIR]);
}
console.log(`js-debug ${JS_DEBUG_VERSION}, chrome ${CHROME}`);
console.log(`breakpoints: ${BP_FILE}:${BP_LINES.join(',')} against ${URL_}`);

const server = spawn('node', [DAP_ENTRY, String(PORT)], { stdio: ['ignore', 'pipe', 'pipe'] });
server.stdout.on('data', d => process.stdout.write('[server] ' + d));
server.stderr.on('data', d => process.stdout.write('[server-err] ' + d));
await new Promise(r => setTimeout(r, 1500));

let sessionCount = 0;
function makeSession(config, label) {
  return new Promise((resolve) => {
    const sock = net.connect(PORT, '127.0.0.1');
    let seq = 1, buf = Buffer.alloc(0);
    const pending = new Map();
    const api = { label, send, sock, events: [] };
    function send(command, args) {
      const id = seq++;
      const body = JSON.stringify({ seq: id, type: 'request', command, arguments: args });
      sock.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
      return new Promise(res => pending.set(id, res));
    }
    sock.on('data', chunk => {
      buf = Buffer.concat([buf, chunk]);
      for (;;) {
        const idx = buf.indexOf('\r\n\r\n');
        if (idx < 0) return;
        const len = Number(/Content-Length: (\d+)/.exec(buf.slice(0, idx).toString())[1]);
        if (buf.length < idx + 4 + len) return;
        const msg = JSON.parse(buf.slice(idx + 4, idx + 4 + len).toString());
        buf = buf.slice(idx + 4 + len);
        handle(msg);
      }
    });
    function handle(msg) {
      if (msg.type === 'response') {
        const p = pending.get(msg.request_seq); pending.delete(msg.request_seq);
        p && p(msg);
      } else if (msg.type === 'event') {
        if (msg.event === 'output') {
          const b = msg.body || {};
          if (b.category === 'stderr' || b.category === 'console' || /source map/i.test(b.output || '')) {
            console.log(`[${label}][${b.category}] ${String(b.output).trim()}`);
          }
        } else if (msg.event === 'breakpoint') {
          console.log(`[${label}] breakpoint event: ${JSON.stringify(msg.body.breakpoint)}`);
        } else if (msg.event === 'stopped') {
          console.log(`[${label}] STOPPED: ${JSON.stringify(msg.body)}`);
          api.stopped = msg.body;
        } else if (msg.event !== 'loadedSource' && msg.event !== 'thread' && msg.event !== 'process') {
          console.log(`[${label}] event ${msg.event}`);
        }
      } else if (msg.type === 'request') {
        // reverse request
        console.log(`[${label}] reverse request ${msg.command}`);
        if (msg.command === 'startDebugging') {
          const childCfg = { ...config, ...msg.arguments.configuration, request: msg.arguments.request || 'attach' };
          startChild(childCfg);
        }
        const body = JSON.stringify({ seq: seq++, type: 'response', request_seq: msg.seq, success: true, command: msg.command });
        sock.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
      }
    }
    sock.on('connect', () => resolve(api));
  });
}

const children = [];
async function startChild(cfg) {
  const label = 'child' + ++sessionCount;
  const s = await makeSession(cfg, label);
  children.push(s);
  await s.send('initialize', { clientID: 'test', adapterID: 'pwa-chrome', linesStartAt1: true, columnsStartAt1: true, pathFormat: 'path', supportsStartDebuggingRequest: true });
  const rp = s.send(cfg.request === 'launch' ? 'launch' : 'attach', cfg);
  const bp = await s.send('setBreakpoints', { source: { path: BP_FILE }, breakpoints: BP_LINES.map(line => ({ line })) });
  console.log(`[${label}] setBreakpoints -> ${JSON.stringify(bp.body)}`);
  await s.send('configurationDone', {});
  const r = await rp;
  if (!r.success) console.log(`[${label}] ${cfg.request} failed: ${r.message}`);
}

const rootCfg = {
  type: 'pwa-chrome', request: 'launch', name: 'client-debug',
  url: URL_, webRoot: CWD, cwd: CWD, __workspaceFolder: CWD,
  runtimeExecutable: CHROME,
  runtimeArgs: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  userDataDir: USER_DATA_DIR,
  sourceMaps: true, trace: true,
};

const root = await makeSession(rootCfg, 'root');
await root.send('initialize', { clientID: 'test', adapterID: 'pwa-chrome', linesStartAt1: true, columnsStartAt1: true, pathFormat: 'path', supportsStartDebuggingRequest: true });
const lrP = root.send('launch', rootCfg);
const bpRoot = await root.send('setBreakpoints', { source: { path: BP_FILE }, breakpoints: BP_LINES.map(line => ({ line })) });
console.log(`[root] setBreakpoints -> ${JSON.stringify(bpRoot.body)}`);
await root.send('configurationDone', {});
const lr = await lrP;
console.log('[root] launch success=' + lr.success + (lr.message ? ' msg=' + lr.message : ''));

await new Promise(r => setTimeout(r, 8000));
// force a page reload so the breakpoint has a chance to hit (reporter step 4)
for (const c of children) {
  const ev = await c.send('evaluate', { expression: 'location.reload()', context: 'repl' });
  console.log(`[${c.label}] reload eval success=${ev.success} ${ev.message || ''}`);
}
await new Promise(r => setTimeout(r, 10000));
for (const c of children) {
  if (c.stopped) {
    const st = await c.send('stackTrace', { threadId: c.stopped.threadId, levels: 3 });
    console.log(`[${c.label}] STACK ${JSON.stringify((st.body.stackFrames||[]).map(f => `${f.source && f.source.path}:${f.line}:${f.column} ${f.name}`))}`);
  }
}
// click phase: continue any paused session then click the button
for (const c of children) {
  if (c.stopped) {
    const st = await c.send('stackTrace', { threadId: c.stopped.threadId, levels: 3 });
    console.log(`[${c.label}] STACK(render) ${JSON.stringify((st.body.stackFrames||[]).map(f => `${f.source && f.source.path}:${f.line}:${f.column} ${f.name}`))}`);
    c.stopped = null;
    await c.send('continue', { threadId: 1 });
  }
}
for (const c of children) {
  const ev = await c.send('evaluate', { expression: "document.querySelector('#btn') && document.querySelector('#btn').click()", context: 'repl' });
  console.log(`[${c.label}] click eval success=${ev.success} result=${ev.body && ev.body.result} ${ev.message||''}`);
}
await new Promise(r => setTimeout(r, 6000));
for (const c of children) {
  if (c.stopped) {
    const st = await c.send('stackTrace', { threadId: c.stopped.threadId, levels: 3 });
    console.log(`[${c.label}] STACK(click) ${JSON.stringify((st.body.stackFrames||[]).map(f => `${f.source && f.source.path}:${f.line}:${f.column} ${f.name}`))}`);
  } else {
    console.log(`[${c.label}] no stop after click`);
  }
}
// report final breakpoint state per session
for (const s of [root, ...children]) {
  const bp = await s.send('setBreakpoints', { source: { path: BP_FILE }, breakpoints: BP_LINES.map(line => ({ line })) });
  console.log(`[${s.label}] FINAL setBreakpoints -> ${JSON.stringify(bp.body)} stopped=${JSON.stringify(s.stopped || null)}`);
}
await new Promise(r => setTimeout(r, 3000));
process.exit(0);
