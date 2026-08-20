const { test, expect } = require('@playwright/test')

test('slow page chunk -> "Route did not complete loading" + full page reload', async ({ page }) => {
  const logs = []
  const t0 = Date.now()
  const log = (s) => logs.push(`+${((Date.now() - t0) / 1000).toFixed(2)}s ${s}`)

  page.on('console', (m) => log(`[console.${m.type()}] ${m.text()}`))
  page.on('pageerror', (e) => log(`[pageerror] ${e.message}`))
  page.on('request', (r) => {
    if (r.resourceType() === 'document') log(`[document request] ${r.url()}`)
    if (/pages\/about/.test(r.url())) log(`[chunk request] ${r.url()}`)
  })

  await page.goto('/')
  // surface Pages Router routeChangeError in the console
  await page.evaluate(() => {
    window.next.router.events.on('routeChangeError', (err, url) =>
      console.error(`routeChangeError for ${url}: ${err && err.message}`)
    )
  })

  await page.click('#go')
  await page.waitForTimeout(20000)

  console.log(logs.join('\n'))
  await page.screenshot({ path: process.env.SHOT || 'shot.png', fullPage: true })

  const out = logs.join('\n')
  expect(out).toContain('Route did not complete loading')
  // the router falls back to a hard navigation (full page reload)
  expect(out.match(/\[document request\]/g).length).toBeGreaterThan(1)
})
