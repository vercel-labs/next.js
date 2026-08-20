import { chromium } from 'playwright'

const url = process.argv[2]
const label = process.argv[3]
const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
const t0 = Date.now()
const log = []
page.on('console', (m) => log.push(`[console] +${Date.now() - t0}ms ${m.type()}: ${m.text()}`))
await page.goto(url, { waitUntil: 'commit' })
log.push(`navigation committed +${Date.now() - t0}ms`)
let hydrated = null
let resolved = null
let clicks = 0
while (Date.now() - t0 < 25000) {
  const t = Date.now() - t0
  if (resolved === null && (await page.locator('#lazy').count()) > 0) {
    resolved = t
    log.push(`suspense boundary resolved (#lazy present) +${t}ms`)
  }
  if (hydrated === null) {
    try {
      await page.locator('#click').click({ force: true, timeout: 300 })
      clicks++
      const txt = await page.locator('#click').innerText()
      if (txt.trim() !== 'Clicked 0') {
        hydrated = Date.now() - t0
        log.push(`button interactive (text="${txt.trim()}" after ${clicks} clicks) +${hydrated}ms`)
      }
    } catch {}
  }
  if (hydrated !== null && resolved !== null) break
  await page.waitForTimeout(100)
}
log.push(`RESULT ${label}: interactive=${hydrated}ms suspenseResolved=${resolved}ms delta=${hydrated - resolved}ms`)
await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${label}.png`, fullPage: false })
console.log(log.join('\n'))
await browser.close()
