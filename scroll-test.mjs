// Automated check for https://github.com/vercel/next.js/issues/70148
// Usage: next build && next start -p 3000, then: node scroll-test.mjs
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })

await page.goto(BASE + '/shop', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.evaluate(() => window.scrollTo(0, 3000))
await page.waitForTimeout(400)
const before = await page.evaluate(() => window.scrollY)

await page.click('#link-90')
await page.waitForSelector('#detail')
await page.waitForTimeout(1200) // router.refresh() invalidates the router cache

await page.goBack()

const samples = []
for (let i = 0; i < 50; i++) {
  samples.push(
    await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      height: document.documentElement.scrollHeight,
      loading: !!document.querySelector('#shop-loading'),
    }))
  )
  await page.waitForTimeout(60)
}

const final = samples[samples.length - 1]
console.log('scrollY before navigating away:', before)
console.log('loading.tsx shown during back navigation:', samples.some((s) => s.loading))
console.log('document heights seen after back:', [...new Set(samples.map((s) => s.height))])
console.log('scrollY values after back:', [...new Set(samples.map((s) => s.y))])
console.log(final.y === before ? 'PASS: scroll restored' : `FAIL: scroll is ${final.y}, expected ${before}`)

await browser.close()
process.exit(final.y === before ? 0 : 1)
