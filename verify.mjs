import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:3000'
const start = process.env.START || '/p/hello'
const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
page.on('response', async (r) => {
  if (r.url().includes('/_next/data/')) {
    let body = ''
    try { body = await r.text() } catch {}
    console.log('DATA', r.status(), r.url(), body.slice(0, 300))
  }
})
const show = async (label) => {
  const text = (await page.locator('body').innerText()).replace(/\n+/g, ' | ')
  console.log(`${label}: ${text}`)
}
await page.goto(base + start, { waitUntil: 'networkidle' })
await show('initial          ')
await page.click('#enter')
await page.waitForLoadState('networkidle')
await show('in preview mode  ')
await page.click('#end')
await page.waitForLoadState('networkidle')
await page.waitForTimeout(1000)
await show('after end preview')
console.log('ERRORS:', errors.length ? errors.join(' || ') : 'none')
await browser.close()
