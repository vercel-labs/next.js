const { test, expect } = require('@playwright/test');

const shot = (name) =>
  `/workspace/.next-maintainer/reproduction-artifacts/playwright/${name}.png`;

async function goToPage(page, p) {
  await page.getByRole('link', { name: `Page ${p}`, exact: true }).click();
  await expect(page.getByText(`item page ${p} #0`)).toBeVisible();
}

test('back then paginate quickly (< 400ms writeDelay)', async ({ page }) => {
  await page.goto('/shoes/red?tab=product');
  await expect(page.getByText('item page 1 #0')).toBeVisible();
  await goToPage(page, 2);
  await page.waitForTimeout(600);
  await goToPage(page, 3);
  await page.waitForTimeout(600);
  console.log(`url before back: ${new URL(page.url()).search}`);

  await page.goBack();
  await expect(page.getByText('item page 2 #0')).toBeVisible();
  console.log(`url after back: ${new URL(page.url()).search}`);

  // click immediately, i.e. within the 400ms history writeDelay
  await goToPage(page, 3);
  await page.waitForTimeout(1500);
  const search = new URL(page.url()).search;
  console.log(`url after clicking page 3 (UI shows page 3): ${search}`);
  await page.screenshot({ path: shot('fast-click-after-back') });
  expect(search).toContain('page=3');
});

test('back then paginate slowly (> 400ms)', async ({ page }) => {
  await page.goto('/shoes/red?tab=product');
  await goToPage(page, 2);
  await page.waitForTimeout(600);
  await goToPage(page, 3);
  await page.waitForTimeout(600);
  await page.goBack();
  await page.waitForTimeout(800);
  await goToPage(page, 3);
  await page.waitForTimeout(1000);
  const search = new URL(page.url()).search;
  console.log(`slow variant url: ${search}`);
  expect(search).toContain('page=3');
});

test('control: same race without next/router (plain history router)', async ({
  page,
}) => {
  await page.goto('/plain');
  await expect(page.getByText('item page 1 #0')).toBeVisible();
  await goToPage(page, 2);
  await page.waitForTimeout(600);
  await goToPage(page, 3);
  await page.waitForTimeout(600);
  await page.goBack();
  await expect(page.getByText('item page 2 #0')).toBeVisible();
  await goToPage(page, 3);
  await page.waitForTimeout(1500);
  const search = new URL(page.url()).search;
  console.log(`plain history router url after fast click: ${search}`);
  expect(search).toContain('page=3');
});
