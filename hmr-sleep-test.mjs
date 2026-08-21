// Reproduces: HMR stops working after the HMR WebSocket is closed
// (as happens when a laptop sleeps/resumes: net::ERR_NETWORK_IO_SUSPENDED).
// Sleep/resume is emulated by suspend-proxy.mjs dropping every live TCP socket
// while the listener (and the dev server) stay up.
import { chromium } from 'playwright';
import fs from 'node:fs';

const PAGE = new URL('./app/page.tsx', import.meta.url).pathname;
const original = fs.readFileSync(PAGE, 'utf8');
const artifacts = process.env.ARTIFACTS || '.';
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

function setText(t) {
  fs.writeFileSync(PAGE, original.replace('Hello, world!!', t));
}

async function waitForText(page, t, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const body = await page.evaluate(() => document.body.innerText).catch(() => '');
    if (body.includes(t)) return Date.now() - start;
    await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

const browser = await chromium.launch();
const page = await browser.newPage();
const wsEvents = [];
page.on('websocket', (ws) => {
  wsEvents.push(`open ${ws.url()}`);
  log('WS open', ws.url());
  ws.on('close', () => { wsEvents.push(`close ${ws.url()}`); log('WS close', ws.url()); });
  ws.on('socketerror', (e) => { wsEvents.push(`error ${e}`); log('WS error', e); });
});
page.on('console', (m) => log('console:', m.type(), m.text().slice(0, 200)));

setText('Hello, world!!');
await page.goto((process.env.BASE || 'http://localhost:3100') + '/', { waitUntil: 'networkidle' });
log('loaded:', (await page.evaluate(() => document.body.innerText)).trim());
await page.evaluate(() => { window.__stateMarker = 'kept'; });
await new Promise((r) => setTimeout(r, 3000));

// 1) baseline HMR
setText('EDIT-BEFORE-SLEEP');
const t1 = await waitForText(page, 'EDIT-BEFORE-SLEEP');
log('baseline HMR applied:', t1 !== null, t1 !== null ? `${t1}ms` : '');

// 2) emulate sleep/resume: drop all live TCP sockets (dev server keeps running)
log('SUSPEND: signalling proxy to drop sockets');
process.kill(Number(process.env.PROXY_PID), 'SIGUSR2');
await new Promise((r) => setTimeout(r, 10000));
log('RESUME: connectivity restored (proxy still listening)');
const probe = await page.evaluate(async () => (await fetch('/', { cache: 'no-store' })).status);
log('post-resume fetch of / ->', probe);
await new Promise((r) => setTimeout(r, 5000));

// 3) HMR after resume
setText('EDIT-AFTER-SLEEP');
const t2 = await waitForText(page, 'EDIT-AFTER-SLEEP', 30000);
log('post-resume HMR applied:', t2 !== null, t2 !== null ? `${t2}ms` : '');
log('client state survived (no full reload):', await page.evaluate(() => window.__stateMarker === 'kept'));
log('final DOM:', (await page.evaluate(() => document.body.innerText)).trim());
log('websocket events:', JSON.stringify(wsEvents, null, 1));

await page.screenshot({ path: `${artifacts}/after-resume-${process.env.TAG || 'run'}.png`, fullPage: true });
fs.writeFileSync(PAGE, original);
await browser.close();
console.log(`RESULT next=${process.env.TAG} baselineHMR=${t1 !== null} postResumeHMR=${t2 !== null}`);
