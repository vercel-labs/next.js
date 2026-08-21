// Repro driver: Next.js streamed Suspense boundary never reveals when the
// document loads in a hidden (background) tab.
//
// Usage: node cdp-hidden-repro.mjs [http://localhost:3000]
// Requires a running Chrome with --remote-debugging-port (see run.sh).
import fs from 'node:fs';

const PORT = process.env.CDP_PORT || '9333';
const URL_ = process.argv[2] || process.env.REPRO_URL || 'http://localhost:3000';
const OUT = process.env.ARTIFACT_DIR || '.';

const v = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
console.log('Browser:', v.Browser, '\nTarget URL:', URL_, '\n');
const ws = new WebSocket(v.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const myId = ++id; pending.set(myId, (m) => (m.error ? rej(new Error(method + ' ' + JSON.stringify(m.error))) : res(m.result)));
  ws.send(JSON.stringify({ id: myId, method, params, sessionId }));
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evalIn = async (s, expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, s)).result.value;

// 1. A foreground tab that owns focus for the whole run.
const fg = await send('Target.createTarget', { url: 'about:blank' });
const fgS = (await send('Target.attachToTarget', { targetId: fg.targetId, flatten: true })).sessionId;
await send('Target.activateTarget', { targetId: fg.targetId });

// 2. Load the app in a BACKGROUND tab => document is hidden from birth.
const bg = await send('Target.createTarget', { url: URL_, background: true });
const bgS = (await send('Target.attachToTarget', { targetId: bg.targetId, flatten: true })).sessionId;
await send('Target.activateTarget', { targetId: fg.targetId });

const PROBE = `(${function () {
  const seg = document.getElementById('S:0');
  return {
    visibilityState: document.visibilityState,
    readyState: document.readyState,
    RB_length: window.$RB ? window.$RB.length : null,
    typeof_RT: typeof window.$RT,
    'S:0_in_dom': !!seg,
    'S:0_hidden_attr': seg ? seg.hasAttribute('hidden') : null,
    fallback_present: !!document.getElementById('fallback'),
    revealed_present: !!document.getElementById('revealed'),
    visible_text: document.body ? document.body.innerText.trim().slice(0, 60) : null,
  };
}})()`;

for (const label of ['3s', '10s', '20s', '35s']) {
  await sleep(label === '3s' ? 3000 : label === '35s' ? 15000 : 7000);
  console.log(`--- hidden tab, ~${label} after load start ---`);
  console.log(JSON.stringify(await evalIn(bgS, PROBE), null, 2));
}

fs.writeFileSync(`${OUT}/hidden-tab-dom.html`, await evalIn(bgS, 'document.documentElement.outerHTML'));

// 3. Control: same URL in a foreground tab.
const ctl = await send('Target.createTarget', { url: URL_ });
const ctlS = (await send('Target.attachToTarget', { targetId: ctl.targetId, flatten: true })).sessionId;
await sleep(5000);
console.log('--- control: foreground tab ---');
console.log(JSON.stringify(await evalIn(ctlS, PROBE), null, 2));
try {
  const shot = await send('Page.captureScreenshot', {}, ctlS);
  fs.writeFileSync(`${OUT}/control-foreground-revealed.png`, Buffer.from(shot.data, 'base64'));
} catch {}

// 4. Manually running the page's own reveal proves the parked queue is the only blocker.
await send('Target.activateTarget', { targetId: fg.targetId });
console.log('--- hidden tab after running window.$RV(window.$RB) manually ---');
console.log(JSON.stringify(await evalIn(bgS, `(function(){ if (typeof $RV==='function' && window.$RB && window.$RB.length) $RV(window.$RB); return ${PROBE}; })()`), null, 2));

ws.close();
