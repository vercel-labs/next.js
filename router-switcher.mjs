import { chromium } from 'playwright'

const OUT = process.env.OUT_DIR || '.'
const START =
  process.env.START_URL ||
  'https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const name = (process.env.TAG || 'case')

await page.goto(START, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(3000)
console.log('start url        :', page.url())
await page.screenshot({ path: `${OUT}/${name}-01-before.png` })

const btn = page.locator('button[aria-label="Open directory select"]:visible').first()
await btn.click()
await page.waitForTimeout(1000)
await page.screenshot({ path: `${OUT}/${name}-02-dropdown.png` })
const items = await page.$$eval('[role="option"]', (els) =>
  els.map((e) => (e.textContent || '').trim().slice(0, 80))
)
console.log('dropdown options :', JSON.stringify(items))

const opt = page.locator('[role="option"]').filter({ hasText: /Pages Router/i }).first()
console.log('option text      :', (await opt.textContent()).trim())
await opt.click()
await page.waitForTimeout(4000)
console.log('url after switch :', page.url())
console.log('h1 after switch  :', (await page.locator('h1').first().textContent().catch(() => null)))
console.log('title after      :', await page.title())
const notFound = await page.getByText(/404|This page could not be found/i).count()
console.log('404 text count   :', notFound)
await page.screenshot({ path: `${OUT}/${name}-03-after.png` })
await browser.close()
