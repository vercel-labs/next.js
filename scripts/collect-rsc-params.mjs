/**
 * Reproduces https://github.com/vercel/next.js/issues/65335
 *
 * Loads /category/1, /category/2 and / (each a fresh hard load) and records the
 * `_rsc` cache-busting query param that the router uses for requests to the
 * SAME target URL /product/1, then re-fetches every variant and compares the
 * response bodies byte-for-byte.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = process.env.OUT_DIR || 'artifacts'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const rows = []

for (const from of ['/category/1', '/category/2', '/']) {
  const page = await browser.newPage()
  const seen = []
  page.on('request', (req) => {
    const u = new URL(req.url())
    if (u.pathname === '/product/1' && u.searchParams.has('_rsc')) {
      const h = req.headers()
      seen.push({
        rsc: u.searchParams.get('_rsc'),
        prefetch: h['next-router-prefetch'] ?? null,
        segment: h['next-router-segment-prefetch'] ?? null,
        tree: h['next-router-state-tree'] ?? null,
      })
    }
  })
  await page.goto(BASE + from, { waitUntil: 'networkidle' })
  for (const r of seen) {
    const res = await fetch(`${BASE}/product/1?_rsc=${r.rsc}`, {
      headers: {
        RSC: '1',
        ...(r.prefetch ? { 'Next-Router-Prefetch': r.prefetch } : {}),
        ...(r.segment ? { 'Next-Router-Segment-Prefetch': r.segment } : {}),
        ...(r.tree ? { 'Next-Router-State-Tree': r.tree } : {}),
      },
    })
    rows.push({ from, ...r, body: await res.text(), vary: res.headers.get('vary') })
  }
  await page.screenshot({ path: `${OUT}/${from.replace(/\W/g, '_') || 'root'}.png` })
  await page.close()
}
await browser.close()

console.log('\n=== requests to /product/1, grouped by requested segment ===')
const bySegment = new Map()
for (const r of rows) {
  if (!bySegment.has(r.segment)) bySegment.set(r.segment, [])
  bySegment.get(r.segment).push(r)
}
let reproduced = false
for (const [segment, group] of bySegment) {
  console.log(`\nsegment: ${segment}`)
  for (const r of group) {
    console.log(
      `  linked from ${r.from.padEnd(12)} -> /product/1?_rsc=${r.rsc}  bytes=${r.body.length}`
    )
  }
  const params = new Set(group.map((r) => r.rsc))
  const bodies = new Set(group.map((r) => r.body))
  console.log(`  distinct _rsc values: ${params.size}, distinct bodies: ${bodies.size}`)
  if (params.size > 1 && bodies.size === 1) reproduced = true
}
console.log(`\nVary: ${rows[0]?.vary}`)
console.log(
  reproduced
    ? '\nREPRODUCED: byte-identical RSC payloads are served under several _rsc cache keys (one per originating route) -> CDN cache fragmentation'
    : '\nNOT REPRODUCED'
)
