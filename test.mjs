// Automated reproduction driver for https://github.com/vercel/next.js/issues/83034
// Usage: npm run build && npm start   (in another shell)  then: node test.mjs
// Optional env: BASE=http://localhost:3000  CHROME=/path/to/chrome
import { chromium } from 'playwright';

const base = process.env.BASE || 'http://localhost:3000';
const launchOpts = { args: ['--no-sandbox'] };
if (process.env.CHROME) launchOpts.executablePath = process.env.CHROME;

const browser = await chromium.launch(launchOpts);
const page = await (await browser.newContext()).newPage();

async function read(label) {
  await page.waitForSelector('#rendered');
  await page.waitForTimeout(700); // let the layout's server action settle
  const text = await page.textContent('#rendered');
  console.log(label.padEnd(16), '|', text);
  return text;
}

await page.goto(base + '/');
const first = await read('initial /');
let failed = false;
for (let i = 1; i <= 5; i++) {
  await page.click('#to-test');
  await page.waitForFunction(() => location.pathname === '/test');
  await read(`${i}: /test`);
  await page.click('#to-home');
  await page.waitForFunction(() => location.pathname === '/');
  const home = await read(`${i}: /`);
  if (i === 1 && home === first) {
    failed = true;
    console.log('BUG: 2nd visit to / reused the initial render (stale force-dynamic page)');
    await page.screenshot({ path: 'stale-home-second-visit.png' });
  } else if (i === 1) {
    console.log('OK: 2nd visit to / re-rendered');
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
