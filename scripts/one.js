const { chromium } = require('playwright')
;(async () => {
  const url = process.argv[2]
  const dpr = Number(process.argv[3] || 1)
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ deviceScaleFactor: dpr })
  const page = await ctx.newPage()
  const msgs = []
  page.on('console', (m) => msgs.push(`[${m.type()}] ${m.text()}`))
  const reqs = []
  page.on('request', (r) => { if (r.url().includes('/_next/image')) reqs.push(r.url()) })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(7000)
  console.log(url, 'dpr='+dpr)
  console.log(' requests:', JSON.stringify(reqs))
  msgs.forEach(m => console.log('  ', m))
  await browser.close()
})()
