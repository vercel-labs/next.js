import { chromium } from 'playwright';
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const p = await b.newPage();
// 1) Direct load of / (slow generateMetadata)
const samples = [];
const t0 = Date.now();
const nav = p.goto('http://localhost:3000/', { waitUntil: 'load' });
const iv = setInterval(async () => {
  try { samples.push([Date.now()-t0, await p.title()]); } catch {}
}, 100);
await nav;
await p.waitForTimeout(500);
clearInterval(iv);
console.log('--- direct load / ---');
let prev;
for (const [t, title] of samples) if (title !== prev) { console.log(`t+${t}ms title=${JSON.stringify(title)}`); prev = title; }
await p.screenshot({ path: `${OUT}/direct-load-final.png` });

// 2) client navigation from /other -> /
await p.goto('http://localhost:3000/other', { waitUntil: 'load' });
console.log('on /other title=', JSON.stringify(await p.title()));
const samples2 = [];
const t1 = Date.now();
const iv2 = setInterval(async () => { try { samples2.push([Date.now()-t1, await p.title()]); } catch {} }, 100);
await p.click('a');
await p.waitForTimeout(3000);
clearInterval(iv2);
console.log('--- client nav /other -> / ---');
prev = undefined;
for (const [t, title] of samples2) if (title !== prev) { console.log(`t+${t}ms title=${JSON.stringify(title)}`); prev = title; }
await b.close();
