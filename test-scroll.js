const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = process.env.OUT_DIR || '/workspace/.next-maintainer/reproduction-artifacts/playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  page.on('console', m => console.log('BROWSER', m.type(), m.text()));
  page.on('request', r => { const u = r.url(); if (u.includes('localhost') && !u.includes('/_next/static') && !u.includes('__nextjs')) console.log('REQ', r.method(), u); });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#home-title');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => window.scrollY);
  console.log('home scrollY at bottom:', before);
  await page.screenshot({ path: OUT + '/1-home-bottom.png' });

  await page.click('#to-page2');
  await page.waitForSelector('#page2-title');
  await page.waitForFunction(() => document.querySelector('#cookie-state')?.textContent.includes('ok'), null, { timeout: 20000 });
  await page.waitForTimeout(1000);
  console.log('page2 height:', await page.evaluate(() => document.body.scrollHeight));
  await page.screenshot({ path: OUT + '/2-page2-after-cookie-action.png' });

  console.log('--- browser back ---');
  await page.goBack();
  for (let i = 1; i <= 10; i++) {
    await page.waitForTimeout(300);
    const s = await page.evaluate(() => ({ y: window.scrollY, h: document.body.scrollHeight }));
    console.log(`+${i * 300}ms scrollY=${s.y} docHeight=${s.h}`);
  }
  const after = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: OUT + '/3-home-after-back.png' });
  console.log(`RESULT expected=${before} actual=${after} -> ${after === before ? 'PASS (restored)' : 'FAIL (scroll restoration broken)'}`);
  await browser.close();
})();
