import { test, expect } from '@playwright/test'

// Variant A: press Enter immediately after navigation resolves (hydration race)
test('A: immediate Enter after goto', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' })
  const button = page.locator('#continue')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Step two: your address' })).toBeVisible({ timeout: 5000 })
})

// Variant B: click instead of keyboard
test('B: click immediately after goto', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' })
  await page.locator('#continue').click()
  await expect(page.getByRole('heading', { name: 'Step two: your address' })).toBeVisible({ timeout: 5000 })
})
