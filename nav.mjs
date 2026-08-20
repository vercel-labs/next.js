import { chromium } from 'playwright';
const base = process.argv[2];
const br = await chromium.launch();
const p = await br.newPage();
p.on('console', m=>{});
await p.goto(base+'/', {waitUntil:'networkidle'});
await p.waitForTimeout(2500);
console.log('title /:', await p.title());
for (const href of ['/with-loading','/without-loading']) {
  console.log('--- hover', href);
  await p.hover(`a[href="${href}"]`);
  await p.waitForTimeout(2500);
  console.log('--- click', href);
  await p.click(`a[href="${href}"]`);
  await p.waitForTimeout(2500);
  console.log('title', href, ':', await p.title());
  await p.screenshot({path:'/workspace/.next-maintainer/reproduction-artifacts/playwright/canary'+href.replace('/','-')+'.png'});
  await p.goto(base+'/', {waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
}
await br.close();
