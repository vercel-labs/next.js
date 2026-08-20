import { webkit, devices } from 'playwright';
const url = process.argv[2], label = process.argv[3];
const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14 Pro Max'] });
const page = await ctx.newPage();
const s = async () => Math.round(await page.evaluate(() => window.scrollY));
await page.goto(url, { waitUntil: 'load' });
const first = []; for (let i=0;i<8;i++){ first.push(await s()); await page.waitForTimeout(250); }
await page.reload({ waitUntil: 'load' });
const reload = []; for (let i=0;i<8;i++){ reload.push(await s()); await page.waitForTimeout(250); }
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(500);
await page.reload({ waitUntil: 'load' });
const afterScrollReload = []; for (let i=0;i<8;i++){ afterScrollReload.push(await s()); await page.waitForTimeout(250); }
await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${label}.png` });
console.log(JSON.stringify({label, first, reload, afterScrollReload}));
await browser.close();
