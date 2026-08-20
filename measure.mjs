import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const PORT = process.env.PORT || 3000
const results = []
for (const id of ['action-then-push','push-then-action','push-only']) {
  const b = await chromium.launch()
  const page = await (await b.newContext()).newPage()
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
  const t0 = Date.now()
  await page.click('#' + id)
  let urlAt = null, contentAt = null
  while (Date.now() - t0 < 12000) {
    if (!urlAt && page.url().endsWith('/target')) urlAt = Date.now() - t0
    if (!contentAt && await page.locator('#target').count()) contentAt = Date.now() - t0
    if (urlAt && contentAt) break
    await page.waitForTimeout(50)
  }
  const log = await page.locator('#log').textContent().catch(()=> '')
  results.push({ id, urlChangedAfterMs: urlAt, targetRenderedAfterMs: contentAt, clientLog: log })
  await page.screenshot({ path: `${OUT}/${process.env.TAG||'dev'}-${id}.png`, fullPage: true })
  await b.close()
}
console.log(JSON.stringify(results, null, 2))
