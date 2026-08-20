import { webkit, devices } from 'playwright';
const url = process.argv[2];
const label = process.argv[3] || 'run';
const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'], recordVideo: undefined });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load' });
const samples = [];
for (let i = 0; i < 12; i++) {
  samples.push(await page.evaluate(() => Math.round(window.scrollY)));
  await page.waitForTimeout(250);
}
await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${label}.png` });
console.log(label, 'scrollY samples:', JSON.stringify(samples));
await browser.close();
