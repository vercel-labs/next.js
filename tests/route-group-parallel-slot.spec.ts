import { test, expect } from '@playwright/test'

// Issue 92335: prefetch cache should isolate parallel slots across route groups.
// Verifies that after prefetching + navigating + browser back/forward the
// restored tree (children slot AND @analytics slot) matches the URL.
test('back/forward restores correct tree per parallel slot', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (r) => requests.push(`${r.method()} ${r.url()}`))

  await page.goto('/')
  await expect(page.locator('#children-slot #page')).toHaveText('home-page')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-default')

  // Links are prefetched on view; give the segment cache a moment.
  await page.waitForTimeout(1000)

  await page.click('#to-shop')
  await expect(page.locator('#children-slot #page')).toContainText('shop-page group=(shop)')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-shop')
  const shopFirst = await page.locator('#children-slot #page').innerText()

  await page.click('#to-about')
  await expect(page.locator('#children-slot #page')).toContainText('about-page group=(marketing)')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-about')

  // back -> /shop
  await page.goBack()
  await expect(page).toHaveURL(/\/shop$/)
  await expect(page.locator('#children-slot #page')).toContainText('shop-page group=(shop)')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-shop')
  const shopRestored = await page.locator('#children-slot #page').innerText()
  console.log('shop first =', shopFirst, '| shop restored =', shopRestored)

  // back -> /
  await page.goBack()
  await expect(page).toHaveURL('http://localhost:3111/')
  await expect(page.locator('#children-slot #page')).toHaveText('home-page')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-default')

  // forward -> /shop
  await page.goForward()
  await expect(page.locator('#children-slot #page')).toContainText('shop-page group=(shop)')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-shop')

  // forward -> /about
  await page.goForward()
  await expect(page.locator('#children-slot #page')).toContainText('about-page group=(marketing)')
  await expect(page.locator('#analytics-slot #analytics')).toHaveText('analytics-about')

  await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/final-about.png' })
  console.log('RSC/prefetch requests:\n' + requests.filter((r) => r.includes('_rsc') || !r.includes('/_next/static')).join('\n'))
})
