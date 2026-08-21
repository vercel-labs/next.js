import { chromium } from 'playwright'
import fs from 'node:fs'

const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const targets = [
  { name: 'next15', url: 'http://localhost:3015/' },
  { name: 'next16', url: 'http://localhost:3016/' },
  { name: 'next163', url: 'http://localhost:3163/' },
]
const browser = await chromium.launch()
for (const t of targets) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const reqs = []
  page.on('request', (r) => reqs.push({ url: r.url(), rsc: r.headers()['rsc'] ?? null, nextUrl: r.headers()['next-url'] ?? null, seg: r.headers()['next-router-segment-prefetch'] ?? null }))
  await page.goto(t.url, { waitUntil: 'load' })
  await page.waitForTimeout(6000)
  const doc = reqs.filter((r) => !r.url.includes('/_next/static'))
  const prefetch = doc.filter((r) => r.rsc)
  fs.writeFileSync(`${ART}/${t.name}-requests.json`, JSON.stringify(doc, null, 2))
  await page.screenshot({ path: `${ART}/${t.name}-page.png`, fullPage: true })
  console.log(`\n=== ${t.name} ===`)
  console.log('total non-static requests:', doc.length)
  console.log('RSC prefetch requests:', prefetch.length)
  const bySeg = {}
  for (const p of prefetch) bySeg[p.seg ?? '(none)'] = (bySeg[p.seg ?? '(none)'] || 0) + 1
  console.log('by segment-prefetch header:', bySeg)
  console.log('sample:', prefetch.slice(0, 6).map((p) => `${new URL(p.url).pathname}${new URL(p.url).search} seg=${p.seg}`))
  await ctx.close()
}
await browser.close()
