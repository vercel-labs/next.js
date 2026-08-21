// Counts RSC requests for /dashboard/<slug> around a server-action submit.
// Usage: node verify.mjs   (server must be running on BASE, default :3000)
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage()
const reqs = []

page.on('request', (r) => {
  const h = r.headers()
  if (r.url().includes('/dashboard/') && (h.rsc || r.url().includes('_rsc'))) {
    reqs.push({ phase, url: r.url().replace(base, ''), prefetch: h['next-router-prefetch'] ?? null })
  }
})

let phase = 'load'
await page.goto(base, { waitUntil: 'networkidle' })

phase = 'blur (prefetch)'
await page.fill('#title', 'My New Board')
await page.locator('#title').blur()
await page.waitForTimeout(2000)

phase = 'submit (server action + router.push)'
await page.click('button[type=submit]')
await page.waitForURL('**/dashboard/my-new-board')
await page.waitForTimeout(2000)

console.table(reqs)
const extra = reqs.filter((r) => r.phase.startsWith('submit'))
console.log(
  extra.length > 0
    ? `BUG: ${extra.length} extra request(s) for the already-prefetched URL after the server action`
    : 'OK: navigation reused the prefetch'
)
await browser.close()
process.exit(extra.length > 0 ? 1 : 0)
