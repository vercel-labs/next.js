// Automated reproduction of https://github.com/vercel/next.js/issues/87681
//
// Steps: load the page, call router.refresh(), and abort the in-flight RSC
// request the way a browser reload does. The aborted refresh stream surfaces
// `TypeError: network error` inside the app's error boundary.
import { chromium } from 'playwright';

const url = process.env.URL || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text().slice(0, 300)}`));
page.on('requestfailed', (r) => logs.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));

await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('#slow');

await page.click('#refresh');            // router.refresh() -> streaming RSC request
await page.waitForTimeout(400);          // still in flight (Slow takes 4s)
await page.evaluate(() => window.stop()); // browser reload aborts in-flight requests

await page.waitForTimeout(3000);
const hit = await page.locator('#error-boundary').count();
console.log('error boundary rendered:', hit === 1);
if (hit) console.log('error message:', await page.locator('#error-message').innerText());
console.log(logs.join('\n'));
await page.screenshot({ path: 'error-boundary.png', fullPage: true });
await browser.close();
process.exit(hit ? 0 : 1);
