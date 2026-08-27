import { chromium } from 'playwright'
const BASE = process.env.BASE ?? 'http://localhost:3100'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const log = (...a) => console.log(...a)
const state = (p) =>
  p.evaluate(() => ({
    url: location.pathname,
    markers: document.querySelectorAll('#__next-page-redirect').length,
    sentinel: window.__sentinel ?? null,
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent).join(','),
  }))

const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()
const navs = []
page.on('request', (r) => r.isNavigationRequest() && navs.push(r.method() + ' ' + r.url()))

log('=== load /slow-gated (gate redirects 1.5s after hydration) ===')
await page.goto(BASE + '/slow-gated', { waitUntil: 'load' })
for (let t = 0; t < 4000; t += 200) {
  await page.waitForTimeout(200)
  log(String(t).padStart(4), JSON.stringify(await state(page)), JSON.stringify(navs))
}
await page.screenshot({ path: `${OUT}/4-slow-gate-timeline.png` })

log('\n=== now click Link on the (post-redirect) active route ===')
navs.length = 0
const href = await page.evaluate(() => {
  const a = document.querySelector('a[href="/other"]') || document.querySelector('a[href="/"]')
  return a ? a.getAttribute('href') : null
})
log('clicking', href)
if (href) {
  await page.click(`a[href="${href}"]`)
  await page.waitForTimeout(1500)
  log('after click:', JSON.stringify(await state(page)), 'navRequests:', JSON.stringify(navs))
}
await page.screenshot({ path: `${OUT}/5-slow-gate-after-click.png` })
await browser.close()
