import { test, expect } from '@playwright/test'

// Hidden <Activity> subtrees stay in the DOM, so every locator is scoped to
// the visible (currently rendered) route.
const visible = (page: import('@playwright/test').Page, sel: string) =>
  page.locator(sel).filter({ visible: true })

test('forward navigation (link click) to page A should render a fresh instance', async ({
  page,
}) => {
  await page.goto('/a')
  await visible(page, '#counter').click()
  await visible(page, '#counter').click()
  await expect(visible(page, '#counter')).toHaveText('count: 2')

  await visible(page, '#to-b').click()
  await expect(visible(page, 'h1')).toHaveText('Page B')

  // forward navigation via link click
  await visible(page, '#to-a').click()
  await expect(visible(page, 'h1')).toHaveText('Page A')

  console.log('after link click to /a, counter =', await visible(page, '#counter').textContent())
  // Expected: a fresh Page A -> "count: 0"
  await expect(visible(page, '#counter')).toHaveText('count: 0')
})

test('browser Back button should restore state', async ({ page }) => {
  await page.goto('/a')
  await visible(page, '#counter').click()
  await expect(visible(page, '#counter')).toHaveText('count: 1')
  await visible(page, '#to-b').click()
  await expect(visible(page, 'h1')).toHaveText('Page B')
  await page.goBack()
  console.log('after Back to /a, counter =', await visible(page, '#counter').textContent())
  await expect(visible(page, '#counter')).toHaveText('count: 1')
})
