// Drives a browser through two client navigations and reports whether each one
// was a client-side (soft) navigation or a full-page (MPA) reload caused by the
// deployment-id skew check.
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const BASE = process.env.BASE || 'http://localhost:3100'
const OUT =
  process.env.OUT || '/workspace/.next-maintainer/reproduction-artifacts/playwright'

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const documentLoads = []
  page.on('load', () => documentLoads.push(page.url()))
  const rscResponses = []
  page.on('response', (res) => {
    const dpl = res.headers()['x-nextjs-deployment-id']
    if (dpl) rscResponses.push(`${res.status()} ${res.url()} -> ${dpl}`)
  })

  const rawHtml = await (await page.request.get(BASE + '/')).text()
  const initialDpl =
    /data-dpl-id="([^"]+)"/.exec(rawHtml)?.[1] ?? null

  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  console.log('document loads after initial goto:', documentLoads.length)

  // navigation 1: prerendered / -> dynamic /dynamic
  const before1 = documentLoads.length
  await page.click('#to-dynamic')
  await page.waitForSelector('#dynamic')
  await page.waitForLoadState('networkidle')
  const hardNav1 = documentLoads.length > before1
  await page.screenshot({ path: path.join(OUT, '1-after-nav-to-dynamic.png') })

  // navigation 2: dynamic /dynamic -> prerendered /
  const before2 = documentLoads.length
  await page.click('#to-home')
  await page.waitForSelector('#home')
  await page.waitForLoadState('networkidle')
  const hardNav2 = documentLoads.length > before2
  await page.screenshot({ path: path.join(OUT, '2-after-nav-to-home.png') })

  // navigation 3: prerendered / -> dynamic /dynamic again (loop continues)
  const before3 = documentLoads.length
  await page.click('#to-dynamic')
  await page.waitForSelector('#dynamic')
  await page.waitForLoadState('networkidle')
  const hardNav3 = documentLoads.length > before3

  const result = {
    initialDeploymentIdInPrerenderedHtml: initialDpl,
    documentLoadsTotal: documentLoads.length,
    documentLoadUrls: documentLoads,
    'nav1 / -> /dynamic was full page reload': hardNav1,
    'nav2 /dynamic -> / was full page reload': hardNav2,
    'nav3 / -> /dynamic was full page reload': hardNav3,
    responsesWithDeploymentIdHeader: rscResponses,
  }
  console.log(JSON.stringify(result, null, 2))
  fs.writeFileSync(
    path.join(OUT, 'result.json'),
    JSON.stringify(result, null, 2)
  )
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
