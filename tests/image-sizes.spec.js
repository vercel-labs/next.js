const { test, expect } = require('@playwright/test');

for (const dpr of [1, 2]) {
  test(`image widths requested at 375px viewport, DPR ${dpr}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 900 }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    const requested = [];
    page.on('request', (r) => {
      const m = r.url().match(/\/_next\/image\?.*?w=(\d+)/);
      if (m) requested.push(Number(m[1]));
    });
    await page.goto('/', { waitUntil: 'networkidle' });
    for (const id of ['case1', 'case2', 'case3', 'case4']) {
      const img = page.locator(`#${id} img`).first();
      const info = await img.evaluate((el) => ({
        sizes: el.sizes,
        srcsetWidths: (el.srcset.match(/w=\d+/g) || []).map((s) => s.slice(2)).join(','),
        descriptors: (el.srcset.match(/\d+[wx]/g) || []).join(','),
        currentSrc: el.currentSrc.replace(/^https?:\/\/[^/]+/, ''),
        renderedWidth: el.getBoundingClientRect().width,
        naturalWidth: el.naturalWidth,
      }));
      console.log(`DPR${dpr} ${id}`, JSON.stringify(info));
    }
    await page.screenshot({ path: `../.next-maintainer/reproduction-artifacts/playwright/dpr${dpr}.png`, fullPage: true });
    console.log(`DPR${dpr} requested widths:`, requested.sort((a, b) => a - b).join(','));
    await ctx.close();
  });
}
