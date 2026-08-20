import { chromium } from '@playwright/test';
const url = process.env.URL || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', m => {
  const l = m.location();
  console.log(`[console.${m.type()}] (${l.url}:${l.lineNumber + 1}:${l.columnNumber + 1})\n${m.text()}`);
});
page.on('pageerror', e => console.log('[pageerror]\n' + e.stack));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: process.env.SHOT || '/workspace/.next-maintainer/reproduction-artifacts/playwright/page.png' });
await browser.close();
