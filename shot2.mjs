import { webkit, chromium } from 'playwright';
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
for (const [name, bt] of [['webkit', webkit], ['chromium', chromium]]) {
  const b = await bt.launch();
  const ctx = await b.newContext({
    viewport: { width: 900, height: 900 },
    deviceScaleFactor: 3,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000/compare', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/rows-${name}.png`, fullPage: true });
  for (const w of [100, 200, 300, 400, 500]) {
    await p.locator(`#n${w}`).screenshot({ path: `${out}/row-${name}-n${w}.png` });
    await p.locator(`#g${w}`).screenshot({ path: `${out}/row-${name}-g${w}.png` });
  }
  const used = await p.evaluate(() =>
    [100, 200, 300, 400, 500].map((w) => {
      const n = document.getElementById('n' + w);
      const g = document.getElementById('g' + w);
      const r = (e) => {
        const c = getComputedStyle(e);
        return c.fontFamily + '|' + c.fontWeight;
      };
      const range = (e) => {
        const rg = document.createRange();
        rg.selectNodeContents(e);
        return rg.getBoundingClientRect().width.toFixed(2);
      };
      return { w, n: r(n), g: r(g), nWidth: range(n), gWidth: range(g) };
    })
  );
  console.log(name, JSON.stringify(used));
  await b.close();
}
