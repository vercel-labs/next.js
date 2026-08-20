const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const base = process.env.BASE || 'http://localhost:3001';
  await p.goto(base + '/', { waitUntil: 'load' });
  for (let i = 1; i <= 2; i++) {
    const t0 = Date.now();
    await p.click('a[href="/dashboard"]');
    let f = null;
    while (Date.now() - t0 < 4000) {
      const t = await p.evaluate(() => document.body.innerText).catch(()=>'');
      if (/SUSPENSE_FALLBACK|LOADING_TSX_FALLBACK/.test(t)) { f = Date.now()-t0; break; }
      if (/SLOW_DATA/.test(t)) break;
      await new Promise(r=>setTimeout(r,30));
    }
    await p.waitForSelector('#slow');
    console.log(`softnav ${i}: fallbackAt=${f===null?'NEVER':f+'ms'} doneAt=${Date.now()-t0}ms`);
    await p.goBack({ waitUntil: 'load' });
  }
  await b.close();
})();
