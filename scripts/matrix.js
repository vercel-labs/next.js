const { chromium } = require('playwright')
const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
;(async () => {
  const base = process.argv[2]
  const routes = process.argv.slice(3)
  const browser = await chromium.launch()
  for (const dpr of [1, 2]) {
    for (const r of routes) {
      const ctx = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 1000, height: 700 } })
      const page = await ctx.newPage()
      const warns = []
      page.on('console', (m) => { if (/preloaded using link preload/.test(m.text())) warns.push(m.text()) })
      const reqs = []
      page.on('request', (q) => { if (/ball|_next\/image/.test(q.url())) reqs.push(q.url().replace(base, '')) })
      let ok = true
      try { await page.goto(base + r, { waitUntil: 'load' }) } catch (e) { ok = false }
      await page.waitForTimeout(6000)
      const st = await page.evaluate(() => [...document.images].map(i => ({ cs: i.currentSrc, complete: i.complete })))
      console.log(`dpr=${dpr} ${r} warn=${warns.length} reqs=${JSON.stringify(reqs)} imgs=${JSON.stringify(st)}`)
      warns.forEach(w => console.log('   WARN:', w))
      if (warns.length) await page.screenshot({ path: `${ART}/warn${r.replace(/\//g,'_')}-dpr${dpr}.png` })
      await ctx.close()
    }
  }
  await browser.close()
})()
