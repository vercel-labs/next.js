// Usage: npm run dev  (in another shell), then: node check-focus.mjs [port]
import { chromium } from 'playwright'

const port = process.argv[2] ?? 3000
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  window.__focus = []
  document.addEventListener('focusin', (e) => window.__focus.push(e.target.id || e.target.tagName))
})
// Click the <Link href="/"> that lives in the root layout while already on "/"
await page.click('#home-link')
await page.waitForTimeout(1500)
console.log('focusin sequence:', await page.evaluate(() => window.__focus))
console.log('document.activeElement:', await page.evaluate(() => document.activeElement.id || document.activeElement.tagName))
console.log('window.scrollY:', await page.evaluate(() => window.scrollY))
await browser.close()
