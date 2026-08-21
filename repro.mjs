import { chromium } from 'playwright'

const ART = './'
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()
const logs = []
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })

// 1st push: works
await page.click('button')
await page.waitForTimeout(1500)
logs.push('--- now blocking *index.json ---')

// simulate asset load failure (Chrome devtools "Block request URL")
await page.route('**/index.json*', (r) => r.abort('failed'))

await page.click('button')
await page.waitForTimeout(4000)

await page.screenshot({ path: `${ART}/after-blocked-index-json.png`, fullPage: true })
const overlay = await page
  .locator('nextjs-portal')
  .first()
  .evaluate((el) => el.shadowRoot?.textContent ?? '')
  .catch(() => '')
console.log(logs.join('\n'))
console.log('=== OVERLAY TEXT ===')
console.log(overlay.slice(0, 1500))
console.log('=== URL ===', page.url())
await browser.close()
