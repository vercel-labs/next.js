import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3999'
const TAG = process.env.TAG || 'run'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
const events = []
page.on('console', (m) => { if (m.type() === 'error') events.push(`console.error: ${m.text().slice(0,300)}`) })
page.on('pageerror', (e) => events.push(`pageerror: ${e.message.split('\n')[0]}`))
page.on('requestfailed', (r) => events.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`))
page.on('response', (r) => events.push(`http ${r.status()} ${r.request().method()} ${r.url()}`))

try {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2000)
  await page.click('text=Contact', { timeout: 8000 })
  await page.waitForTimeout(5000)
} catch (e) {
  events.push('DRIVER: ' + e.message.split('\n')[0])
}
console.log('URL after nav:', page.url())
try { console.log('h1:', await page.textContent('h1', { timeout: 3000 })) } catch { console.log('h1: <none>') }
try { await page.screenshot({ path: `${OUT}/${TAG}.png` }) } catch {}
console.log(events.join('\n'))
await browser.close()
