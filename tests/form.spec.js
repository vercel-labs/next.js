import { test, expect } from '@playwright/test'

test('enter on continue advances the step', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Step one: your details' })).toBeVisible()
  const button = page.locator('#continue')
  await button.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Step two: your address' })).toBeVisible({ timeout: 5000 })
})
