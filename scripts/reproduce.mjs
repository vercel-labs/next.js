// Deterministic harness for https://github.com/vercel/next.js/issues/86400
// Requires `next build && next start` running on http://localhost:3000
//
// Usage: node scripts/reproduce.mjs [networkLatencyMs=300] [clickDelayAfterPrefetchMs=200]
import { chromium } from 'playwright'

const LATENCY = Number(process.argv[2] || 300)
const CLICK_AFTER = Number(process.argv[3] || 200)

const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()

// Simulate real-world RTT so the "click while the full prefetch is in flight"
// window is wide enough to hit reliably.
await page.route('**/*', async (route) => {
  await new Promise((r) => setTimeout(r, LATENCY))
  await route.continue()
})

let t0 = 0
const rscRequests = []
page.on('request', (r) => {
  const h = r.headers()
  if (!h['rsc']) return
  rscRequests.push(r.url())
  console.log(
    `REQ +${Date.now() - t0}ms ${r.url()} prefetch=${h['next-router-prefetch'] || '-'} segment=${h['next-router-segment-prefetch'] || '-'}`
  )
})

await page.goto('http://localhost:3000/', { waitUntil: 'load' })
t0 = Date.now()

// app/Link.tsx dispatches router.prefetch(href, { kind: FULL }) 2s after mouseenter
await page.hover('a')
await page.waitForTimeout(2000 + CLICK_AFTER)
console.log(`CLICK +${Date.now() - t0}ms`)
await page.click('a')
await page.waitForTimeout(9000)

console.log(
  `\nlatency=${LATENCY}ms clickAfterPrefetch=${CLICK_AFTER}ms => ${rscRequests.length} RSC requests`
)
console.log(
  rscRequests.length > 2
    ? 'BUG: navigation issued its own RSC request instead of reusing the in-flight FULL prefetch (server renders /search twice).'
    : 'OK: navigation reused the in-flight FULL prefetch.'
)

await context.close()
await browser.close()
