import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:3000'
const ART = process.env.ART || '.'

let offline = true
const rsc = []

const browser = await chromium.launch()
const page = await browser.newPage()

await page.route('**/*', async (route) => {
  const url = new URL(route.request().url())
  if (offline && (url.searchParams.has('_rsc') || route.request().headers()['rsc'])) {
    rsc.push({ phase: offline ? 'offline' : 'online', path: url.pathname, aborted: true })
    return route.abort('internetdisconnected')
  }
  if (url.searchParams.has('_rsc') || route.request().headers()['rsc']) {
    rsc.push({ phase: 'online', path: url.pathname, aborted: false })
  }
  return route.continue()
})

// start offline before load so in-viewport prefetches fail
await page.addInitScript(() => {
  Object.defineProperty(navigator, 'onLine', { get: () => false, configurable: true })
})
await page.goto(BASE + '/', { waitUntil: 'load' })
await page.waitForSelector('#home')
await page.waitForTimeout(2000)
const beforeCount = rsc.length
console.log('prefetch attempts while offline:', JSON.stringify(rsc))

// restore network
offline = false
await page.evaluate(() => {
  Object.defineProperty(navigator, 'onLine', { get: () => true, configurable: true })
  window.dispatchEvent(new Event('online'))
})
await page.waitForTimeout(5000)
const after = rsc.slice(beforeCount)
console.log('prefetch requests after online event:', JSON.stringify(after))

// now click a link -> shows whether navigation is a client transition or full reload
let navigated = false
page.on('framenavigated', (f) => { if (f === page.mainFrame()) navigated = true })
await page.evaluate(() => { window.__marker = true })
await page.click('#to-a')
await page.waitForSelector('#a')
const markerSurvived = await page.evaluate(() => Boolean(window.__marker))
console.log('after click: hard navigation (page reloaded)?', !markerSurvived)
await page.screenshot({ path: ART + '/after-click.png' })

console.log('RESULT:', after.length > 0 ? 'PREFETCH RETRIED (no bug)' : 'NO PREFETCH AFTER ONLINE (bug reproduced)')
await browser.close()
