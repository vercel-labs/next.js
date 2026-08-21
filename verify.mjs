// Drives the reported steps and prints the URL after each back navigation.
// Usage: node verify.mjs http://localhost:3000
// Requires: npm i -D playwright && npx playwright install chromium
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${base}/dog/1`, { waitUntil: 'load' }); // "typed in the address bar": no user gesture
await page.waitForTimeout(10000);                        // let it auto-push a few times
console.log('before back:', await page.evaluate(() => ({ url: location.href, historyLength: history.length })));

for (let i = 0; i < 3; i++) {
  await page.goBack();
  console.log(`after back #${i + 1}:`, await page.evaluate(() => ({ url: location.href, historyLength: history.length })));
}

await browser.close();
