// Variant: the deployment-id mismatch is discovered on a *dynamic (Full) prefetch*
// whose entries were spawned for a navigation target (prefetch={true} link that
// appears only after the flip), then we navigate to it.
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3100'
const OUT = process.env.ARTIFACT_DIR || '.'
const CLICK_DELAY = Number(process.env.CLICK_DELAY ?? 300)

const browser = await chromium.launch()
const page = await browser.newPage()
const lines = []
page.on('console', (m) => lines.push(`[console.${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => lines.push(`[pageerror] ${e.message}`))
const reqs = []
page.on('request', (r) => reqs.push(`${r.method()} ${r.url()}`))

await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  window.__navEvents = []
  navigation.addEventListener('currententrychange', () =>
    window.__navEvents.push('currententrychange:' + location.pathname)
  )
})
await page.waitForTimeout(1500)
await fetch(BASE + '/__flip')
await page.click('#reveal') // triggers the prefetch={true} dynamic prefetch on the NEW deployment
await page.waitForTimeout(CLICK_DELAY)
await page.click('#late-link')
await page.waitForTimeout(16000)

const state = await page.evaluate(() => ({
  pathname: location.pathname,
  navEvents: window.__navEvents,
  hasShell: !!document.querySelector('#records2-shell'),
  hasSkeleton: !!document.querySelector('#records2-skeleton'),
  hasDynamic: !!document.querySelector('#records2-dynamic'),
  bodyText: document.body.innerText.replace(/\s+/g, ' ').trim(),
}))
await page.screenshot({ path: `${OUT}/fullprefetch-after-click.png`, fullPage: true })
const report = { urlAfter16s: page.url(), ...state, consoleLines: lines, requests: reqs.slice(-14) }
fs.writeFileSync(`${OUT}/report-fullprefetch.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
console.log(
  state.pathname === '/records2' && state.hasDynamic
    ? 'RESULT: navigation completed (no wedge)'
    : 'RESULT: navigation did not complete after 16s'
)
await browser.close()
