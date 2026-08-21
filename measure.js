const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const tag = process.argv[3] || 'dev';
(async () => {
  const b = await chromium.launch();
  for (const p of ['baseline', 'static', 'dynamic', 'dynamic-suspense']) {
    const page = await b.newPage();
    const logs = [];
    page.on('console', m => { if (m.text().startsWith('[render]')) logs.push(m.text()); });
    await page.goto(base + '/' + p, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const shown = await page.textContent('#parent-renders').catch(() => 'n/a');
    console.log(`${tag} /${p}: DOM render count = ${shown}; console lines = ${logs.length}`);
    await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}-${p}.png` });
    await page.close();
  }
  await b.close();
})();
