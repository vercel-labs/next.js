import { chromium } from 'playwright';
const base = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage();
const out = {};
for (const q of ['page=/test', 'page=$foo', 'page=/a/b/c', 'page=a b', 'p=%2Ftest']) {
  await p.goto(`${base}/?${q}`, { waitUntil: 'load' });
  const initial = p.url();
  await p.waitForTimeout(2500);
  out[q] = { initial, after: p.url() };
}
await p.goto(`${base}/?page=/test`, { waitUntil: 'load' });
await p.click('button'); await p.waitForTimeout(800);
await p.goBack(); await p.waitForTimeout(1200);
out['back'] = p.url();
console.log(JSON.stringify(out, null, 2));
await b.close();
