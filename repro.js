const { chromium } = require('playwright');
const path = require('path');

const OUT = process.env.OUT_DIR || '/tmp/pw-out';
const BASE = 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (m) => console.log('[browser]', m.text()));
  for (const id of ['1', '3299']) {
    await page.goto(`${BASE}/app`);
    await page.waitForLoadState('networkidle');
    await page.click(`#push-${id}`);
    await page.waitForTimeout(2500);
    console.log(`router.push("/cars/${id}") -> ${page.url()} (status body: ${(await page.title()) || ''})`);
    console.log('  page text:', (await page.locator('body').innerText()).split('\n')[0]);
    await page.screenshot({ path: path.join(OUT, `push-${id}.png`), fullPage: true });
  }
  await browser.close();
})();
