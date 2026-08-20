const { chromium, devices } = require('playwright')
;(async () => {
  const base = process.argv[2]
  const routes = process.argv.slice(3)
  const browser = await chromium.launch()
  for (const dev of ['iPhone 14 Pro', 'Pixel 7', 'Galaxy S9+']) {
    for (const r of routes) {
      const ctx = await browser.newContext({ ...devices[dev] })
      const page = await ctx.newPage()
      const warns = [], reqs = []
      page.on('console', m => { if (/preloaded using link preload/.test(m.text())) warns.push(m.text()) })
      page.on('request', q => { if (/_next\/image|ball\.png/.test(q.url())) reqs.push(q.url().split('/_next')[1] || q.url()) })
      await page.goto(base + r, { waitUntil: 'load' })
      await page.waitForTimeout(6000)
      const imgs = await page.evaluate(() => [...document.images].map(i => i.currentSrc.split('/_next')[1]))
      console.log(`${dev} ${r} warns=${warns.length} reqs=${JSON.stringify(reqs)} imgs=${JSON.stringify(imgs)}`)
      warns.forEach(w => console.log('   WARN:', w))
      await ctx.close()
    }
  }
  await browser.close()
})()
