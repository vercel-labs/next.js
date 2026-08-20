const { chromium } = require('playwright')
const base = process.argv[2] || 'http://localhost:3102'
const shots = '/workspace/.next-maintainer/reproduction-artifacts/playwright/'
;(async () => {
  const browser = await chromium.launch()
  for (const c of ['variable', 'weight400', 'weightlist', 'optional']) {
    // fresh context each time = cold HTTP cache (equivalent to a hard refresh)
    const ctx = await browser.newContext({ viewport: { width: 800, height: 700 } })
    const page = await ctx.newPage()
    await page.goto(`${base}/${c}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    const r = await page.evaluate(() => {
      const out = { faces: [...document.fonts].filter(f=>f.status==='loaded').map(f=>`${f.family} ${f.weight}`), widths: {} }
      document.querySelectorAll('[data-measure]').forEach((el) => {
        out.widths[el.dataset.measure.split('-').pop()] = +el.getBoundingClientRect().width.toFixed(1)
      })
      return out
    })
    console.log(c, JSON.stringify(r))
    await page.screenshot({ path: `${shots}${new URL(base).hostname}-${c}.png`, fullPage: true })
    await ctx.close()
  }
  await browser.close()
})()
