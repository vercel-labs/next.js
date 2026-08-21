// Loads the app through the proxy, records HMR websocket activity, edits a
// source file and reports whether the HMR update reaches the browser.
import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.env.BASE_URL || 'http://localhost:8888/app1/20250924.1/';
const outDir = process.env.OUT_DIR || 'playwright';
const label = process.env.LABEL || 'run';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const page = await browser.newPage();
const sockets = [];
page.on('websocket', (ws) => {
  const rec = { url: ws.url(), frames: 0, closed: false };
  ws.on('framereceived', () => rec.frames++);
  ws.on('close', () => (rec.closed = true));
  sockets.push(rec);
});

await page.goto(base, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
console.log('initial text:', await page.textContent('#msg'));

const file = 'pages/index.js';
const original = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, original.replace('hello v1', 'hello v2'));

let updated = false;
try {
  await page.waitForFunction(
    () => document.querySelector('#msg')?.textContent?.includes('v2'),
    undefined,
    { timeout: 20000 }
  );
  updated = true;
} catch {}
fs.writeFileSync(file, original);

console.log(`[${label}] websockets seen: ${JSON.stringify(sockets)}`);
console.log(`[${label}] HMR update applied: ${updated}`);
await page.screenshot({ path: `${outDir}/${label}.png`, fullPage: true });
await browser.close();
process.exit(updated ? 0 : 1);
