import { chromium } from 'playwright'
const base = 'http://localhost:3000'
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)
await cdp.send('Network.enable')
await page.goto(base + '/', { waitUntil: 'load' })
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 1000, downloadThroughput: 625000, uploadThroughput: 125000 })
await page.waitForTimeout(3000)
const t0 = Date.now()
await page.click('#link-status')
let tPending = null
for (let i = 0; i < 300; i++) {
  if (await page.locator('#link-status-pending').count()) { tPending = Date.now() - t0; break }
  if (await page.locator('#loading').count()) break
  await page.waitForTimeout(10)
}
console.log('useLinkStatus pending indicator visible after', tPending === null ? 'NEVER (before loading.tsx replaced the page)' : tPending + 'ms')
await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/linkstatus-pending.png' })
await browser.close()
