import { test, expect } from '@playwright/test'

test('clicking a prefetched Link performs a client-side navigation', async ({
  page,
}) => {
  const txtRequests = []
  page.on('request', (r) => {
    if (r.url().includes('.txt')) txtRequests.push(r.url())
  })
  const navigations = []
  page.on('framenavigated', (f) => {
    if (f === page.mainFrame()) navigations.push(f.url())
  })
  const logs = []
  page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`))

  await page.goto('/')
  await expect(page.locator('#home')).toBeVisible()
  const loadId = await page.evaluate(() => window.__PAGE_LOAD_ID)
  await page.evaluate(() => {
    window.__SPA_MARKER = 'kept'
  })

  await page.click('#to-about')
  await page.waitForTimeout(3000)

  const state = await page.evaluate(() => ({
    url: location.href,
    heading: document.querySelector('h1')?.id ?? null,
    marker: window.__SPA_MARKER ?? null,
    loadId: window.__PAGE_LOAD_ID,
  }))

  console.log('--- observed ---')
  console.log('txt requests:', txtRequests)
  console.log('main-frame navigations:', navigations)
  console.log('state after click:', state)
  console.log('same document (soft nav):', state.loadId === loadId)
  console.log('console:', logs.join('\n'))
  await page.screenshot({
    path: `./test-results/after-click-${process.env.CASE || 'no-ct'}.png`,
  })

  expect(state.heading, 'about page rendered').toBe('about')
  expect(state.marker, 'window state survived => client-side navigation').toBe(
    'kept'
  )
})
