import { chromium } from 'playwright';
const B = process.env.BASE || 'http://localhost:3000';
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const p = await b.newPage();
for (const route of ['client-effect','server-rendered']) {
  await p.goto(`${B}/${route}`, {waitUntil:'networkidle'});
  await p.waitForFunction(() => !document.querySelector('#out').textContent.includes('Loading'), null, {timeout:10000}).catch(()=>{});
  const before = await p.textContent('#out');
  await p.click('#btn');
  await p.waitForTimeout(2500);
  const after = await p.textContent('#out');
  await p.screenshot({path: `${OUT}/${route}-after-refresh.png`});
  console.log(`[${route}] before: ${before}`);
  console.log(`[${route}] after : ${after}`);
  console.log(`[${route}] CHANGED: ${before !== after}`);
}
await b.close();
