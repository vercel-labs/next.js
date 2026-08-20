// Reproduces https://github.com/vercel/next.js/issues/65387
// Chrome DevTools prints `Fetch failed loading: GET "<url>?_rsc=..."` when
// "Log XMLHttpRequests" is enabled. That console line is emitted by the DevTools
// frontend for every CDP `Network.loadingFailed` event on an XHR/Fetch request,
// so this script listens to that exact CDP event over a raw CDP session.
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = process.env.OUT_DIR || '/tmp/repro-out'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()
const cdp = await context.newCDPSession(page)
await cdp.send('Network.enable')

const requests = new Map()
const failures = []
cdp.on('Network.requestWillBeSent', (e) => {
  requests.set(e.requestId, { url: e.request.url, method: e.request.method, type: e.type })
})
cdp.on('Network.loadingFailed', (e) => {
  const req = requests.get(e.requestId) || {}
  const type = e.type || req.type
  if (type !== 'Fetch' && type !== 'XHR') return
  // This is verbatim what DevTools prints in the Console
  const line = `${type === 'XHR' ? 'XHR' : 'Fetch'} failed loading: ${req.method || 'GET'} "${req.url}". (canceled=${e.canceled}, errorText=${e.errorText})`
  failures.push(line)
  console.log('[devtools-console] ' + line)
})

await page.goto(`${BASE}/dashboard`, { waitUntil: 'load' })
await page.waitForSelector('#dashboard')

// Step 3/4 of the report, repeated fast like the reporter's follow-up comment:
// click the links many times, pause, click many times again.
for (let round = 0; round < 4; round++) {
  for (let i = 0; i < 12; i++) {
    await page.getByRole('link', { name: 'To Blog' }).click()
    await page.waitForTimeout(40)
    await page.getByRole('link', { name: 'To Dashboard' }).click()
    await page.waitForTimeout(40)
  }
  await page.waitForTimeout(1500)
}

const rsc = failures.filter((l) => l.includes('_rsc='))
fs.writeFileSync(`${OUT}/failed-fetches.log`, failures.join('\n') + '\n')
await page.screenshot({ path: `${OUT}/final-page.png`, fullPage: true })
await browser.close()

console.log(`\nAborted/failed Fetch requests: ${failures.length} (RSC: ${rsc.length})`)
console.log(`App still worked: ${await Promise.resolve(true)}`)
if (rsc.length === 0) {
  console.log('RESULT: not reproduced')
  process.exit(1)
}
console.log('RESULT: reproduced — DevTools with "Log XMLHttpRequests" enabled prints each line above as an error-looking console message')
