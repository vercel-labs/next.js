import { chromium } from 'playwright'
const BASE = process.env.BASE ?? 'http://localhost:3100'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const log = (...a) => console.log(...a)

const state = (p) =>
  p.evaluate(() => ({
    url: location.pathname,
    markers: document.querySelectorAll('#__next-page-redirect').length,
    hiddenMarkers: [...document.querySelectorAll('#__next-page-redirect')].filter(
      (e) => !!e.closest('[hidden]')
    ).length,
    sentinel: window.__sentinel ?? null,
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent).join(','),
  }))

async function timeline(page, ms = 3000, step = 100) {
  for (let t = 0; t < ms; t += step) {
    await page.waitForTimeout(step)
    log(String(t).padStart(4), JSON.stringify(await state(page)))
  }
}

const browser = await chromium.launch()

// --- Scenario 1: natural streamed redirect timeline -----------------------
{
  const page = await (await browser.newContext()).newPage()
  log('\n=== 1. natural streamed redirect on /gated (no cookie) ===')
  await page.goto(BASE + '/gated', { waitUntil: 'commit' })
  await timeline(page, 3000)
  await page.screenshot({ path: `${OUT}/1-natural-timeline.png` })
  await page.context().close()
}

// --- Scenario 2: marker present in DOM => Link click hard-navigates -------
{
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  log('\n=== 2. stale marker in hidden subtree + Link click ===')
  await page.goto(BASE + '/target', { waitUntil: 'load' })
  await page.waitForTimeout(500)
  log('before:', JSON.stringify(await state(page)))
  await page.evaluate(() => {
    const holder = document.createElement('div')
    holder.hidden = true // simulates a hidden <Activity> subtree
    holder.innerHTML =
      '<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=/gated">'
    document.body.appendChild(holder)
  })
  log('after injecting stale marker:', JSON.stringify(await state(page)))
  const reqs = []
  page.on('request', (r) => r.isNavigationRequest() && reqs.push(r.url()))
  await page.click('a[href="/other"]')
  await page.waitForTimeout(1500)
  log('after Link click:', JSON.stringify(await state(page)))
  log('navigation requests:', JSON.stringify(reqs))
  await page.screenshot({ path: `${OUT}/2-stale-marker-hard-nav.png` })
  await ctx.close()
}

// --- Scenario 3: control, no marker --------------------------------------
{
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  log('\n=== 3. control: same click without marker ===')
  await page.goto(BASE + '/target', { waitUntil: 'load' })
  await page.waitForTimeout(500)
  log('before:', JSON.stringify(await state(page)))
  const reqs = []
  page.on('request', (r) => r.isNavigationRequest() && reqs.push(r.url()))
  await page.click('a[href="/other"]')
  await page.waitForTimeout(1500)
  log('after Link click:', JSON.stringify(await state(page)))
  log('navigation requests:', JSON.stringify(reqs))
  await page.screenshot({ path: `${OUT}/3-control-soft-nav.png` })
  await ctx.close()
}

await browser.close()
