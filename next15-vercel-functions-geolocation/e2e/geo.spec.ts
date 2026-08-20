import { test, expect } from '@playwright/test'

// Mocking geolocation for middleware == sending the x-vercel-ip-* headers
// that @vercel/functions' geolocation() reads. Works in `next dev` and on Vercel preview.
test.use({
  extraHTTPHeaders: {
    'x-vercel-ip-country': 'IT',
    'x-vercel-ip-city': 'Rome',
    'x-vercel-ip-latitude': '41.890221',
    'x-vercel-ip-longitude': '12.492348',
  },
})

test('middleware sees mocked geolocation', async ({ page }) => {
  const res = await page.goto('/geo')
  const body = await res!.json()
  expect(body.geolocation).toMatchObject({ country: 'IT', city: 'Rome' })
  expect(body.legacyGeo).toBeUndefined() // request.geo removed in Next 15
  await page.screenshot({ path: 'playwright/geo.png' })
})
