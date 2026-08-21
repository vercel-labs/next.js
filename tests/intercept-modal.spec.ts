import { test, expect } from '@playwright/test'

// Same URL (/photo/1) reached via soft nav (intercepted into @modal) and via
// hard load / back-forward (full page). Checks the route cache does not leak
// the intercepted entry into the non-intercepted slot context and vice versa.
test('intercepted vs full route entries stay isolated across back/forward', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(800) // let prefetches settle
  await page.click('#to-photo')
  await expect(page).toHaveURL(/\/photo\/1$/)
  await expect(page.locator('#modal-slot #modal')).toHaveText('intercepted-modal-photo-1')
  await expect(page.locator('#children-slot #page')).toHaveText('home-page')

  await page.goBack()
  await expect(page).toHaveURL('http://localhost:3111/')
  await expect(page.locator('#modal-slot #modal')).toHaveText('modal-default')

  await page.goForward()
  await expect(page).toHaveURL(/\/photo\/1$/)
  await expect(page.locator('#modal-slot #modal')).toHaveText('intercepted-modal-photo-1')

  // Hard navigation to the same URL must render the full page, not the modal.
  await page.reload()
  await expect(page.locator('#children-slot #page')).toHaveText('full-photo-1')
  await expect(page.locator('#modal-slot #modal')).toHaveText('modal-default')
  await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/photo-hard-load.png' })
})
