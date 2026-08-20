const { chromium } = require('playwright')
;(async () => {
  const url = process.argv[2]
  const scale = process.argv[3]
  const browser = await chromium.launch({ args: [`--force-device-scale-factor=${scale}`] })
  const ctx = await browser.newContext({ viewport: null })
  const page = await ctx.newPage()
  const warns = [], reqs = []
  page.on('console', m => { if (/preload/.test(m.text())) warns.push(m.text()) })
  page.on('request', r => { if (/_next\/image|ball\.png/.test(r.url())) reqs.push(r.url().split('/_next')[1] || r.url()) })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(6000)
  const info = await page.evaluate(() => ({ dpr: devicePixelRatio, imgs: [...document.images].map(i => i.currentSrc.split('/_next')[1]) }))
  console.log(`scale=${scale} ${url} dpr=${info.dpr} imgs=${JSON.stringify(info.imgs)} reqs=${JSON.stringify(reqs)} warns=${warns.length}`)
  warns.forEach(w => console.log('   WARN:', w))
  await browser.close()
})()
