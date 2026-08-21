const { chromium } = require('playwright');
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';

(async () => {
  const browser = await chromium.launch();
  for (const which of ['direct', 'transition']) {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') pageErrors.push('console.error: ' + m.text().slice(0, 200)); });
    await page.goto('http://localhost:3000/');
    await page.click('#' + which);
    await page.waitForTimeout(3000);
    const hasBoundary = await page.locator('#error-boundary').count();
    console.log('=== button:', which);
    console.log('error boundary rendered:', hasBoundary > 0);
    console.log('boundary message:', hasBoundary ? await page.locator('#error-message').innerText() : 'n/a');
    console.log('browser errors:', JSON.stringify(pageErrors, null, 2));
    await page.screenshot({ path: `${OUT}/${which}.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
})();
