// Automated check: open pages in Chromium and print which error.js rendered in each slot.
// Usage: node verify.js http://localhost:3000
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const dump = async (label) => {
    await page.waitForTimeout(2000);
    console.log(
      label,
      '| #children ->',
      JSON.stringify(await page.locator('#children').innerText()),
      '| #slot ->',
      JSON.stringify(await page.locator('#slot').innerText())
    );
  };
  await page.goto(base + '/', { waitUntil: 'load' });
  await dump('initial load "/"                 ');
  await page.getByRole('link', { name: '/page/one' }).click();
  await dump('client nav to "/page/one"        ');
  await page.goto(base + '/page/one', { waitUntil: 'load' });
  await dump('hard load "/page/one"  (BUG)     ');
  await page.goto(base + '/static/one', { waitUntil: 'load' });
  await dump('hard load "/static/one" (BUG)    ');
  await browser.close();
})();
