import { chromium } from 'playwright'
const base = process.env.BASE_URL || 'http://localhost:3000'
const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const cases = ['no-prefetch', 'prefetch', 'link-status']
const browser = await chromium.launch()
for (const c of cases) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'load' })
  await page.waitForTimeout(2500) // let idle prefetching settle
  const t0 = Date.now()
  await page.click('#' + c)
  let tLoading = null
  try {
    await page.waitForSelector('#loading', { timeout: 5000 })
    tLoading = Date.now() - t0
  } catch {}
  await page.screenshot({ path: `${ART}/${c}-500ms-after-click.png` })
  await page.waitForSelector('#content', { timeout: 15000 })
  const tContent = Date.now() - t0
  console.log(`${c}: loading.tsx visible after ${tLoading === null ? 'NEVER' : tLoading + 'ms'}, content after ${tContent}ms`)
  await ctx.close()
}
await browser.close()
