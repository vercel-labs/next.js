const { test, expect } = require('@playwright/test');

// PASSES: unmatched route -> not-found.js metadata is used (SSR + hydrated)
test('unmatched route uses not-found.js metadata', async ({ page }) => {
  await page.goto('/does-not-exist');
  await expect(page.locator('#not-found')).toBeVisible();
  expect(await page.title()).toBe('Not Found | default title');
});

// FAILS: notFound() from a page that exports generateMetadata -> page metadata wins after hydration
test('notFound() from page keeps not-found.js metadata after hydration', async ({ page }) => {
  await page.goto('/entity/missing');
  await expect(page.locator('#not-found')).toBeVisible();
  expect(await page.title()).toBe('Not Found | default title');
});

// FAILS: same, via client-side navigation
test('client-side navigation to notFound() route uses not-found.js metadata', async ({ page }) => {
  await page.goto('/');
  await page.click('#to-missing');
  await expect(page.locator('#not-found')).toBeVisible();
  expect(await page.title()).toBe('Not Found | default title');
});

// FAILS: error.js metadata export is ignored entirely
test('error.js metadata is applied', async ({ page }) => {
  await page.goto('/boom');
  await expect(page.locator('#error')).toBeVisible();
  expect(await page.title()).toBe('Error | default title');
});
