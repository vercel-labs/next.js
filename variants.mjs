import { chromium } from 'playwright';
const base = process.env.BASE;
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:900,height:700}})).newPage();
async function run(label, startUrl, sel, expect) {
  await p.goto(base + startUrl);
  await p.waitForLoadState('networkidle');
  await p.evaluate(() => window.scrollTo(0, 3000));
  await p.waitForTimeout(300);
  const before = await p.evaluate(() => window.scrollY);
  await p.click(sel);
  await p.waitForFunction(t => document.getElementById('title')?.textContent?.includes(t), expect, {timeout:15000});
  await p.waitForTimeout(1200);
  const after = await p.evaluate(() => window.scrollY);
  console.log(`${label.padEnd(38)} before=${before} after=${after} ${after===0?'OK top':'*** STAYED ***'}`);
}
await run('push /a (static, prefetched)', '/', '#push-a', 'page a');
await run('link /a', '/', '#link-a', 'page a');
await run('push /p/1 (dynamic+loading)', '/', '#push-p', 'page 1');
await run('link /p/1 (dynamic+loading)', '/', '#link-p', 'page 1');
await run('push /q?n=2 from /q?n=1 (query only)', '/q?n=1', '#push-q2', 'q 2');
await run('link /q?n=2 from /q?n=1 (query only)', '/q?n=1', '#link-q2', 'q 2');
await run('push in startTransition /a', '/', '#push-t', 'page a');
await b.close();
