import { chromium } from 'playwright'
const base = process.env.BASE_URL || 'http://localhost:3000'
const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const LATENCY = Number(process.env.LATENCY_MS || 1000)
const cases = ['no-prefetch', 'prefetch', 'link-status']
const browser = await chromium.launch()
for (const c of cases) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  await page.goto(base + '/', { waitUntil: 'load' })
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: LATENCY, downloadThroughput: 5_000_000 / 8, uploadThroughput: 1_000_000 / 8,
  })
  await page.waitForTimeout(3000) // let idle prefetching settle
  const t0 = Date.now()
  await page.click('#' + c)
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${ART}/latency${LATENCY}-${c}-300ms-after-click.png` })
  let tLoading = null
  try { await page.waitForSelector('#loading', { timeout: 8000 }); tLoading = Date.now() - t0 } catch {}
  const pendingSeen = await page.locator('#link-status-pending').count()
  await page.waitForSelector('#content', { timeout: 20000 })
  const tContent = Date.now() - t0
  console.log(`[latency ${LATENCY}ms] ${c}: any UI feedback (loading.tsx) after ${tLoading === null ? 'NEVER' : tLoading + 'ms'}, content after ${tContent}ms${c==='link-status' ? `, useLinkStatus pending el present: ${pendingSeen>0}` : ''}`)
  await ctx.close()
}
await browser.close()
