import { chromium } from 'playwright'

const base = process.env.BASE_URL || 'http://localhost:3000'
const artifacts = '/workspace/.next-maintainer/reproduction-artifacts/playwright'

const browser = await chromium.launch()
const results = {}
for (const [name, url] of [
  ['next-app-router', base + '/'],
  ['next-client-only-render', base + '/csr'],
  ['plain-html-control', base + '/plain.html'],
  ['plain-html-deferred-listener', base + '/plain-deferred.html'],
]) {
  const page = await browser.newPage()
  const logs = []
  page.on('console', (m) => logs.push(m.text()))
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `${artifacts}/${name}.png` })
  results[name] = {
    toggleFired: logs.includes('TOGGLE_FIRED'),
    logs,
    open: await page.locator('details').evaluate((e) => e.open),
  }
  await page.close()
}
await browser.close()
console.log(JSON.stringify(results, null, 2))
