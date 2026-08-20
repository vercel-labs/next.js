import { chromium } from 'playwright'

const base = process.argv[2]
const outdir = process.argv[3]
const tag = process.argv[4] ?? 'run'
const selector = process.argv[5] ?? 'ul a'

const browser = await chromium.launch()
const page = await browser.newPage()
const reqs = []
page.on('request', (r) => {
  if (r.url().includes('_rsc') || r.headers()['rsc']) {
    reqs.push({ url: r.url(), start: Date.now(), r })
  }
})
const done = (r) => {
  const e = reqs.find((x) => x.r === r)
  if (e && !e.end) e.end = Date.now()
}
page.on('requestfinished', done)
page.on('requestfailed', done)

await page.goto(base + '/a', { waitUntil: 'load' })
await page.waitForTimeout(5000)
reqs.length = 0
const links = page.locator(selector)
console.log('cards found:', await links.count())
const t0 = Date.now()
console.log('CLICK at', new Date().toISOString())
await links.nth(1).click()
await page.waitForTimeout(30000)
console.log('END at', new Date().toISOString())
await page.screenshot({ path: `${outdir}/${tag}.png` })

const summary = reqs.map((x) => ({
  url: x.url.replace(base, ''),
  ms: (x.end ?? Date.now()) - x.start,
  pending: !x.end,
}))
console.log('RSC requests after click:', summary.length)
for (const s of summary)
  console.log(String(s.ms).padStart(6), s.pending ? 'PENDING' : '       ', s.url.slice(0, 120))
console.log('slow (>900ms):', summary.filter((s) => s.ms > 900).length)
console.log('total wall ms:', Date.now() - t0)
await browser.close()
