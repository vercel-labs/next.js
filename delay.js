const { chromium } = require('playwright')
const base = process.argv[2] || 'http://localhost:3102'
;(async () => {
  const browser = await chromium.launch()
  for (const c of ['variable', 'optional']) {
    const ctx = await browser.newContext({ viewport: { width: 800, height: 700 } })
    const page = await ctx.newPage()
    // simulate a slow network for font files only (cold cache / hard refresh)
    await page.route('**/*.woff2', async (route) => {
      await new Promise((r) => setTimeout(r, 3000))
      await route.continue()
    })
    await page.goto(`${base}/${c}`, { waitUntil: 'load' })
    await page.waitForTimeout(500)
    const early = await page.evaluate(() => {
      const el = document.querySelector('[data-measure]')
      return { w400: el.getBoundingClientRect().width, loaded: [...document.fonts].filter(f=>f.status==='loaded').length }
    })
    await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/slownet-${c}-early.png`, fullPage: true })
    await page.waitForTimeout(5000)
    const late = await page.evaluate(() => {
      const out = {}
      document.querySelectorAll('[data-measure]').forEach(el => out[el.dataset.measure.split('-').pop()] = +el.getBoundingClientRect().width.toFixed(1))
      return { widths: out, loaded: [...document.fonts].filter(f=>f.status==='loaded').length }
    })
    await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/slownet-${c}-late.png`, fullPage: true })
    console.log(c, 'early:', JSON.stringify(early), 'late:', JSON.stringify(late))
    await ctx.close()
  }
  await browser.close()
})()
