import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3100'
const OUT = process.env.ARTIFACT_DIR || '.'

const browser = await chromium.launch()
const page = await browser.newPage()
const consoleLines = []
page.on('console', (m) => consoleLines.push(`[console.${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => consoleLines.push(`[pageerror] ${e.message}`))
const requests = []
page.on('request', (r) => requests.push(`${r.method()} ${r.url()}`))

await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  window.__navEvents = []
  navigation.addEventListener('currententrychange', () => {
    window.__navEvents.push('currententrychange:' + location.pathname)
  })
})
// Let viewport prefetch populate the segment cache with /records' static shell.
await page.waitForTimeout(2000)
const prefetched = requests.filter((r) => r.includes('/records'))
console.log('prefetch requests for /records:\n' + prefetched.join('\n'))

// "Ship a new deployment": every subsequent response carries a new deployment id.
await fetch(BASE + '/__flip')
console.log('flipped deployment id on the server side')

const clickedAt = Date.now()
let hardNavAt = null
page.on('framenavigated', (f) => {
  if (f === page.mainFrame() && hardNavAt === null && f.url().includes('/records')) {
    hardNavAt = Date.now()
  }
})
await page.click('a[href="/records"]')
await page.waitForTimeout(16000)
console.log(
  hardNavAt === null
    ? 'no full document navigation observed'
    : `full document (MPA) navigation to /records fired ${hardNavAt - clickedAt}ms after the click`
)

const state = await page.evaluate(() => ({
  pathname: location.pathname,
  navEvents: window.__navEvents,
  hasShell: !!document.querySelector('#records-shell'),
  hasSkeleton: !!document.querySelector('#records-skeleton'),
  hasDynamic: !!document.querySelector('#records-dynamic'),
  bodyText: document.body.innerText.replace(/\s+/g, ' ').trim(),
}))

await page.screenshot({ path: `${OUT}/after-click.png`, fullPage: true })

const report = {
  urlAfter16s: page.url(),
  ...state,
  consoleLines,
  postFlipRequests: requests.slice(-12),
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))

const wedged = state.pathname !== '/records' && state.hasSkeleton === false && !state.hasDynamic
console.log(
  state.pathname === '/records' && state.hasDynamic
    ? 'RESULT: navigation completed (bug NOT reproduced)'
    : 'RESULT: navigation never completed after 16s (bug reproduced)'
)
await browser.close()
