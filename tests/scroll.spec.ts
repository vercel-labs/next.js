import { test, expect } from '@playwright/test'

async function run(page: any, scrollTo: number, label: string) {
  await page.goto('/page-a')
  await page.waitForSelector('#page-heading')
  await page.evaluate((y: number) => window.scrollTo(0, y), scrollTo)
  await page.waitForFunction((y: number) => Math.round(window.scrollY) === y, scrollTo)
  const before = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: 'Page B' }).click()
  await expect(page.locator('#page-heading')).toHaveText('Page B')
  await page.waitForTimeout(500)
  const after = await page.evaluate(() => window.scrollY)
  console.log(`[${label}] scrollY before=${before} after navigation=${after}`)
  await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${label}.png` })
  return after
}

test('scroll below sticky header height is NOT reset (bug)', async ({ page }) => {
  const after = await run(page, 100, 'scroll-100-below-header-200')
  expect(after, 'expected scroll to reset to 0').toBe(0)
})

test('scroll above sticky header height IS reset (works)', async ({ page }) => {
  const after = await run(page, 500, 'scroll-500-above-header-200')
  expect(after).toBe(0)
})
