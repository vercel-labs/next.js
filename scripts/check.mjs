import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => console.log('  browser:', m.text()));

await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForSelector('#to-about');
await page.waitForTimeout(1000); // let the "gtm.js" probe patch history

await page.click('#to-about');
await page.waitForSelector('#to-home');
await page.waitForTimeout(700);

const n = await page.evaluate(() => window.__gtmHistoryChanges ?? -1);
const layer = await page.evaluate(() => window.dataLayer || []);
console.log('next version                  :', await page.evaluate(() => window.next?.version));
console.log('url after client-side nav      :', page.url());
console.log('gtm.historyChange events fired :', n);
console.log('dataLayer                      :', JSON.stringify(layer));
console.log(n > 0 ? 'PASS: GTM "History change" fired' : 'FAIL: GTM "History change" never fired');
await page.screenshot({ path: process.env.SCREENSHOT || 'result.png' });
await browser.close();
process.exit(n > 0 ? 0 : 1);
