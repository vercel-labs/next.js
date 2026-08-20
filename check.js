const { chromium } = require('playwright');
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tag = process.argv[2] || 'run';
  for (let i = 1; i <= 3; i++) {
    const t0 = Date.now();
    const nav = page.goto(process.env.URL || 'http://localhost:3000/dashboard', { waitUntil: 'commit' });
    let fallbackAt = null;
    // poll DOM for fallback/loading marker
    while (Date.now() - t0 < 4000) {
      const txt = await page.evaluate(() => document.body ? document.body.innerText : '').catch(()=>'');
      if (/SUSPENSE_FALLBACK|LOADING_TSX_FALLBACK/.test(txt)) { fallbackAt = Date.now() - t0; break; }
      if (/SLOW_DATA/.test(txt)) break;
      await new Promise(r => setTimeout(r, 50));
    }
    if (fallbackAt !== null) await page.screenshot({ path: `${OUT}/${tag}-reload${i}-fallback.png` });
    await nav;
    await page.waitForSelector('#slow', { timeout: 10000 });
    const doneAt = Date.now() - t0;
    console.log(`reload ${i}: fallbackVisibleAt=${fallbackAt === null ? 'NEVER' : fallbackAt + 'ms'} finalContentAt=${doneAt}ms`);
  }
  await browser.close();
})();
