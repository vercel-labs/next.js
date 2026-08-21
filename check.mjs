import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3300'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
const collect = async (path, id) => {
  const page = await browser.newPage()
  await page.goto(base + path, { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  const data = await page.evaluate(() => ({
    marks: performance.getEntriesByType('mark').map((e) => e.name),
    measures: performance.getEntriesByType('measure').map((e) => ({ name: e.name, dur: Math.round(e.duration) })),
  }))
  await page.screenshot({ path: `${out}/${id}.png`, fullPage: true })
  console.log(`--- ${path} ---`)
  console.log(JSON.stringify(data, null, 2))
  await page.close()
  return data
}
const app = await collect('/', 'app-router')
const pages = await collect('/pages-page', 'pages-router')
console.log('APP has Next.js-hydration measure:', pages && app.measures.some(m => m.name === 'Next.js-hydration'))
console.log('PAGES has Next.js-hydration measure:', pages.measures.some(m => m.name === 'Next.js-hydration'))
await browser.close()
