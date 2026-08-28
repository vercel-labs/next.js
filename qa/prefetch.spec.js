const { test, expect } = require('@playwright/test')

test('RSC prefetches from /login never 4xx/5xx', async ({ page }) => {
  const rsc = []
  const consoleErrors = []
  page.on('response', (r) => {
    if (r.url().includes('_rsc=') || r.request().headers()['next-router-prefetch']) {
      rsc.push({ url: r.url(), status: r.status() })
    }
  })
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  for (let i = 0; i < 10; i++) {
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
  }
  console.log('prefetch responses:', rsc.length, JSON.stringify(rsc.slice(0, 8), null, 1))
  console.log('console errors:', consoleErrors)
  expect(rsc.length).toBeGreaterThan(0)
  expect(rsc.filter((r) => r.status >= 400)).toEqual([])
  expect(consoleErrors).toEqual([])
})
