import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const targets = [
  ['direct-next-start', 'http://localhost:3010/en'],
  ['proxy-lowercase-percent-encoding', 'http://localhost:3011/en'],
  ['proxy-decoded-at-sign', 'http://localhost:3012/en'],
]
const browser = await chromium.launch()
for (const [name, url] of targets) {
  const page = await (await browser.newContext()).newPage()
  const errors = [], failed = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('response', (r) => r.status() >= 400 && failed.push(r.status() + ' ' + r.url()))
  await page.goto(url, { waitUntil: 'networkidle' })
  let clickOk = 'n/a'
  try { await page.getByRole('button', { name: /count/ }).click({ timeout: 3000 }); clickOk = (await page.getByRole('button', { name: /count/ }).textContent()) } catch (e) { clickOk = 'CLICK FAILED: ' + e.message.split('\n')[0] }
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log('===', name, url)
  console.log('  failed responses:', failed.length ? failed : 'none')
  console.log('  console errors:', errors.length ? errors : 'none')
  console.log('  button after click:', clickOk)
}
await browser.close()
