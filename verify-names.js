const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.click('#inc');
  const res = await p.evaluate(() => {
    const el = document.getElementById('out');
    const key = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
    let f = el[key];
    const names = [];
    while (f) {
      if (typeof f.type === 'function') names.push(f.type.name === '' ? '(anonymous)' : f.type.name);
      f = f.return;
    }
    const hasProfiling = !!(el[key] && 'actualDuration' in el[key]);
    return { names, hasProfiling };
  });
  console.log(JSON.stringify(res, null, 2));
  await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/turbopack-profile-build.png' });
  await b.close();
})();
