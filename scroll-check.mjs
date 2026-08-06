import { chromium } from 'playwright';

const base = process.env.BASE || 'http://localhost:3000';
const tag = process.env.TAG || 'run';
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 } });
const page = await ctx.newPage();

await page.goto(base + '/', { waitUntil: 'networkidle' });
const results = [];
let target = '/about';
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(300);
  const before = await page.evaluate(() => window.scrollY);
  await page.$eval(`a[href="${target}"]`, (el) => el.click());
  await page.waitForFunction((t) => location.pathname === t, target);
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => window.scrollY);
  results.push({ nav: i + 1, to: target, before, after });
  await page.screenshot({ path: `${out}/${tag}-nav${i + 1}.png` });
  target = target === '/about' ? '/' : '/about';
}
console.log(JSON.stringify(results, null, 2));
const reset = results.filter((r) => r.after === 0).length;
console.log(`${tag}: navigations that reset scroll to 0: ${reset}/${results.length}`);
await browser.close();
