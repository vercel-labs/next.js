import { chromium } from 'playwright'
const PORT = process.env.PORT || 3000
const ART = '.'
const browser = await chromium.launch()
const page = await browser.newPage()
const reqs = []
page.on('request', (r) => {
  const h = r.headers()
  if (h['rsc'] || h['next-router-prefetch'] || h['next-router-state-tree'])
    reqs.push({ url: r.url(), prefetch: h['next-router-prefetch'] || '-' })
})

const nav = async (id, label) => {
  const before = await page.textContent('#title')
  const t0 = Date.now()
  await page.click('#' + id)
  await page.waitForFunction(
    (b) => document.querySelector('#title')?.textContent !== b,
    before
  )
  const ms = Date.now() - t0
  console.log(`click ${label}: ${ms}ms -> ${await page.textContent('#title')}`)
  return ms
}

// 1. land on /product/3 directly
await page.goto(`http://localhost:${PORT}/product/3`, { waitUntil: 'load' })
await page.waitForTimeout(3000) // let prefetches settle
console.log('prefetch requests after initial load:')
console.log(reqs.map((r) => `  ${r.prefetch} ${r.url}`).join('\n'))

await nav('link-home', 'Home')
await page.waitForTimeout(3000)
const p1 = await nav('link-p1', 'Product 1 (never landed)')
await page.waitForTimeout(3000)
await nav('link-home', 'Home')
await page.waitForTimeout(3000)
const p3 = await nav('link-p3', 'Product 3 (initially landed)')
console.log('\nall rsc requests:')
console.log(reqs.map((r) => `  prefetch=${r.prefetch} ${r.url}`).join('\n'))
console.log(`\nRESULT: product/1=${p1}ms product/3=${p3}ms`)
await page.screenshot({ path: `${ART}/after-nav-product3.png` })
await browser.close()
