const { test, expect } = require('@playwright/test')

test('next/image inline style violates style-src CSP', async ({ page }) => {
  const violations = []
  page.on('console', (m) => {
    if (m.text().includes('Content Security Policy')) violations.push(m.text())
  })
  await page.goto('/')
  const style = await page.locator('#img').getAttribute('style')
  console.log('style attribute:', JSON.stringify(style))
  console.log('csp console errors:', JSON.stringify(violations, null, 2))
  await page.screenshot({ path: 'screenshot.png', fullPage: true })
  expect(style).toContain('color:transparent')
  expect(violations.length).toBeGreaterThan(0)
})
