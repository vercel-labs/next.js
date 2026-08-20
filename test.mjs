import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:3000'
const TAG = process.env.TAG || 'run'
const n = process.env.N || '1'
const slug = `slug-${n}`
const log = (...a) => console.log(...a)

const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
page.on('response', (r) => {
  const u = new URL(r.url())
  if (u.pathname === '/' + slug) {
    const h = r.headers()
    log(`  [resp] ${u.pathname}${u.search ? '?rsc' : ''} ${r.status()} cache=${h['x-nextjs-cache']} prerender=${h['x-nextjs-prerender']} cc=${h['cache-control']}`)
  }
})

log(`### ${TAG} :: /${slug} (never requested before)`)
await page.goto(BASE + '/')
const t0 = Date.now()
await page.click('#link-' + n)
try {
  await page.waitForSelector('#static', { timeout: 20000 })
  log(`  [client nav] static shell visible after ${Date.now() - t0}ms; fallback shown=${!!(await page.$('#fallback'))}`)
} catch { log('  [client nav] static shell never appeared') }
await page.waitForSelector('#done', { timeout: 20000 })
log(`  [client nav] full content after ${Date.now() - t0}ms`)
await page.screenshot({ path: `./screenshots/${TAG}-${slug}-after-nav.png` })

for (const i of [1, 2]) {
  const t = Date.now()
  await page.goto(BASE + '/' + slug, { waitUntil: 'commit' })
  log(`  [reload ${i}] headers/commit after ${Date.now() - t}ms`)
  await page.waitForSelector('#static', { timeout: 30000 })
  log(`  [reload ${i}] static shell after ${Date.now() - t}ms; fallback shown=${!!(await page.$('#fallback'))}`)
  await page.waitForSelector('#done', { timeout: 30000 })
  log(`  [reload ${i}] full content after ${Date.now() - t}ms`)
}
await browser.close()
