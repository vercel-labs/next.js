const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const pg = await (await b.newContext()).newPage();
  const fails = [];
  pg.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url()); });
  pg.on('pageerror', e => console.log('[pageerror]', String(e).split('\n')[0]));
  await pg.goto('http://localhost:3123/', { waitUntil: 'networkidle' });
  await pg.click('a');                       // client-side navigation to /page1/
  await pg.waitForTimeout(6000);             // wait for any recovery / hard reload
  console.log('url:', pg.url());
  console.log('visible text:', JSON.stringify(await pg.locator('body').innerText()));
  console.log('failed requests:', fails);
  await pg.screenshot({ path: 'blank-page.png', fullPage: true });
  process.exit(0);
})();
