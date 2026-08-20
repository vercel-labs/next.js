const { chromium } = require('playwright')
const url = process.argv[2] || 'http://localhost:3000/'
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const reqs = []
  page.on('request', (r) => {
    const u = r.url()
    if (u.includes('_next/image') || u.includes('box')) reqs.push(u)
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(6000)
  const loads = await page.evaluate(() => window.__loads)
  const native = await page.evaluate(() => window.__native)
  const count = (s) => reqs.filter((u) => u.includes(s)).length
  console.log(JSON.stringify({
    url,
    counterText: await page.textContent('#counter'),
    onLoadCalls: loads,
    nativeImgLoadEvents: native,
    imageRequests: { withOnError_box: count('box.png'), withoutOnError_box2: count('box2.png') },
    allRequests: reqs,
  }, null, 2))
  await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/page.png' })
  await browser.close()
})()
