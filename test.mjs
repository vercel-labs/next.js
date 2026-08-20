import { chromium } from 'playwright'
const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.argv[2] || 'http://localhost:3000'
const b = await chromium.launch()
const ctx = await b.newContext()
const page = await ctx.newPage()
const reqs = []
page.on('request', r => reqs.push(`${r.method()} ${r.url().replace(base,'')}`))
await page.goto(base, { waitUntil: 'networkidle' })
const read = async () => ({
  layout: await page.textContent('#layout-id'),
  layoutRenders: await page.textContent('#layout-renders'),
  page: await page.textContent('#page-id'),
  pageRenders: await page.textContent('#page-renders'),
  state: await page.textContent('#client-state'),
})
console.log('initial      ', JSON.stringify(await read()))

for (const [id, label] of [['without','WITHOUT cookie'],['with','WITH cookie']]) {
  reqs.length = 0
  await page.click('#' + id)
  await page.waitForTimeout(2500)
  console.log(label.padEnd(14), JSON.stringify(await read()))
  console.log('  requests:', JSON.stringify(reqs.filter(r => !r.includes('/_next/static') && !r.includes('webpack'))))
  await page.screenshot({ path: `${ART}/after-${id}-${base.endsWith('3001')?'prod':'dev'}.png` })
}
await b.close()
