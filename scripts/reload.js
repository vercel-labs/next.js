const { chromium } = require('playwright')
;(async () => {
  const url = process.argv[2]
  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  page.on('console', m => { if (/preloaded using link preload/.test(m.text())) console.log('   WARN:', m.text()) })
  for (let i = 0; i < 3; i++) {
    const reqs = []
    const h = r => { if (/_next\/image/.test(r.url())) reqs.push(r.url().split('/_next')[1]) }
    page.on('request', h)
    if (i === 0) await page.goto(url, { waitUntil: 'load' }); else await page.reload({ waitUntil: 'load' })
    await page.waitForTimeout(5000)
    page.off('request', h)
    console.log(`pass ${i} reqs=${JSON.stringify(reqs)}`)
  }
  await browser.close()
})()
