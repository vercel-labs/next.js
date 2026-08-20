const { chromium } = require('playwright')
const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
;(async () => {
  const base = process.argv[2] || 'http://localhost:3000'
  const pages = ['basic', 'hidden', 'spinner', 'belowfold']
  const browser = await chromium.launch({ args: ['--force-device-scale-factor=1'] })
  for (const p of pages) {
    const ctx = await browser.newContext({ deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const msgs = []
    page.on('console', (m) => msgs.push(`[${m.type()}] ${m.text()}`))
    const reqs = []
    page.on('request', (r) => { if (r.url().includes('/_next/image')) reqs.push(r.url()) })
    await page.goto(`${base}/${p}`, { waitUntil: 'load' })
    await page.waitForTimeout(6000)
    const links = await page.evaluate(() => [...document.querySelectorAll('link[rel=preload]')].map(l => l.getAttribute('imagesrcset') || l.href))
    const imgs = await page.evaluate(() => [...document.images].map(i => ({ currentSrc: i.currentSrc, srcset: i.srcset })))
    await page.screenshot({ path: `${ART}/${p}.png`, fullPage: false })
    console.log('=== /' + p)
    console.log(' preloads:', JSON.stringify(links))
    console.log(' imgs:', JSON.stringify(imgs))
    console.log(' image requests:', JSON.stringify(reqs))
    console.log(' console:')
    msgs.forEach(m => console.log('   ', m))
    await ctx.close()
  }
  await browser.close()
})()
