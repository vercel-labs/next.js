// Simulates a module-capable browser without native Set.prototype.union (Chrome 103)
// against `next start` on http://localhost:3100
import { chromium } from 'playwright'

const browser = await chromium.launch()
for (const legacyBrowser of [true, false]) {
  const ctx = await browser.newContext()
  if (legacyBrowser) {
    await ctx.addInitScript(() => {
      delete Set.prototype.union
    })
  }
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text().split('\n')[0])
  })
  await page.goto('http://localhost:3100/', { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  console.log('=== simulated browser without native Set.prototype.union:', legacyBrowser)
  console.log(
    'nomodule (polyfill) script tags:',
    JSON.stringify(
      await page.evaluate(() =>
        [...document.querySelectorAll('script[nomodule]')].map((s) => new URL(s.src).pathname)
      )
    )
  )
  console.log('Set.prototype.union after load:', await page.evaluate(() => typeof Set.prototype.union))
  console.log('rendered:', await page.evaluate(() => document.getElementById('out')?.textContent ?? null))
  console.log('errors:', errors)
  await page.screenshot({ path: `screenshot-legacy-${legacyBrowser}.png`, fullPage: true })
  await ctx.close()
}
await browser.close()
