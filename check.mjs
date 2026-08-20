import { chromium } from 'playwright';
const OUT='./screenshots';
const b = await chromium.launch();
const page = await b.newPage();
const bg = () => page.$eval('#sometesttarget', el => getComputedStyle(el).backgroundColor);
for (const path of ['/', '/appExample']) {
  await page.goto('http://localhost:3000'+path, {waitUntil:'networkidle'});
  console.log(`\n=== ${path} ===`);
  console.log('initial url', page.url(), 'bg', await bg());
  // plain anchor
  await page.getByRole('link', {name:/^1\./}).click();
  await page.waitForTimeout(600);
  console.log('after <a href="#sometesttarget">   url', page.url(), 'bg', await bg());
  await page.screenshot({path:`${OUT}/${path==='/'?'pages':'app'}-anchor.png`});
  // reset
  await page.getByRole('link', {name:/^2\./}).click();
  await page.waitForTimeout(600);
  console.log('after <a href="#"> reset          url', page.url(), 'bg', await bg());
  // next/link
  await page.getByRole('link', {name:/^3\./}).click();
  await page.waitForTimeout(800);
  console.log('after <Link href="#sometesttarget"> url', page.url(), 'bg', await bg());
  await page.screenshot({path:`${OUT}/${path==='/'?'pages':'app'}-nextlink.png`});
}
await b.close();
