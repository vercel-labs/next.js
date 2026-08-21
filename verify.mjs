import { chromium } from 'playwright';
const b = await chromium.launch();
for (const path of ['/', '/renamed', '/no-dep']) {
  const p = await b.newPage();
  await p.goto('http://localhost:' + (process.env.PORT || 3000) + '' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => ({ t0: document.getElementsByTagName('table_0').length, t: document.getElementsByTagName('table').length }));
  console.log(path, JSON.stringify(r));
  await p.close();
}
await b.close();
