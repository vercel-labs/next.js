import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000');
for (const id of ['a','b','c','d']) {
  await p.click('#'+id);
  await p.waitForTimeout(1200);
  console.log(id, 'log=', JSON.stringify(await p.textContent('#log')), 'pending=', await p.textContent('#pending'));
}
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/result.png', fullPage: true });
await b.close();
