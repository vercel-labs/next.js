// Requires `next dev` running on http://localhost:3000
const { chromium } = require('playwright');
const routes = [
  ['custom ErrorBoundary + throwing SERVER component', 'http://localhost:3000/', '#custom-fallback'],
  ['custom ErrorBoundary + throwing CLIENT component', 'http://localhost:3000/client-variant', '#custom-fallback'],
  ['error.js segment boundary + throwing SERVER component', 'http://localhost:3000/with-error-file', '#segment-fallback'],
];
(async () => {
  const browser = await chromium.launch();
  for (const [name, url, sel] of routes) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    const caught = (await page.locator(sel).count()) > 0;
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 200);
    console.log(`${caught ? 'CAUGHT ' : 'UNCAUGHT'} | ${name} | body="${body}"`);
    await page.close();
  }
  await browser.close();
})();
