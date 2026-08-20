import { chromium } from 'playwright'
const url = process.argv[2], label = process.argv[3]
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)
await cdp.send('Network.enable')
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 })
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
const t0 = Date.now(); const log = []
await page.goto(url, { waitUntil: 'commit' })
let hydrated = null, resolved = null, clicks = 0
while (Date.now() - t0 < 30000) {
  const t = Date.now() - t0
  if (resolved === null && (await page.locator('#lazy').count()) > 0) { resolved = t; log.push(`suspense resolved +${t}ms`) }
  if (hydrated === null) {
    try {
      await page.locator('#click').click({ force: true, timeout: 300 }); clicks++
      const txt = (await page.locator('#click').innerText()).trim()
      if (txt !== 'Clicked 0') { hydrated = Date.now() - t0; log.push(`interactive ("${txt}", ${clicks} clicks) +${hydrated}ms`) }
    } catch {}
  }
  if (hydrated !== null && resolved !== null) break
  await page.waitForTimeout(100)
}
log.push(`RESULT ${label}: interactive=${hydrated}ms suspenseResolved=${resolved}ms`)
await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${label}.png` })
console.log(log.join('\n')); await browser.close()
