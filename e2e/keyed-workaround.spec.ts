import { test, expect } from '@playwright/test'

const visible = (page: import('@playwright/test').Page, sel: string) =>
  page.locator(sel).filter({ visible: true })

// The `key={router.bfcacheId}` workaround fixes forward navigation but also
// discards state on Back/Forward navigation.
test('bfcacheId key: forward nav is fresh, but Back no longer restores state', async ({
  page,
}) => {
  await page.goto('/keyed-a')
  await visible(page, '#counter').click()
  await visible(page, '#counter').click()
  await expect(visible(page, '#counter')).toHaveText('count: 2')

  await visible(page, '#to-keyed-b').click()
  await expect(visible(page, 'h1')).toHaveText('Keyed B')
  await visible(page, '#to-keyed-a').click()
  console.log('keyed: after link click =', await visible(page, '#counter').textContent())
  await expect(visible(page, '#counter')).toHaveText('count: 0')

  await visible(page, '#counter').click()
  await visible(page, '#to-keyed-b').click()
  await expect(visible(page, 'h1')).toHaveText('Keyed B')
  await page.goBack()
  console.log('keyed: after Back =', await visible(page, '#counter').textContent())
  await expect(visible(page, '#counter')).toHaveText('count: 1')
})
