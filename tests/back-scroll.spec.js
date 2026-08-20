const { test, expect } = require('@playwright/test');

async function run(page, linkText, anotherSel) {
  await page.goto('/');
  await page.getByText(linkText, { exact: true }).click();
  await page.waitForTimeout(700);
  const afterNav = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollTo(0, 3500));
  await page.waitForTimeout(300);
  const beforeLeave = await page.evaluate(() => window.scrollY);
  await page.click('#to-another');
  await expect(page.locator(anotherSel)).toBeVisible();
  await page.waitForTimeout(500);
  await page.goBack();
  await page.waitForTimeout(1200);
  const afterBack = await page.evaluate(() => window.scrollY);
  return { afterNav, beforeLeave, afterBack, url: page.url() };
}

test('pages router: back button scroll restoration with and without hash', async ({ page }) => {
  const noHash = await run(page, 'pages: test page WITHOUT hash', '#another');
  const withHash = await run(page, 'pages: test page WITH hash', '#another');
  console.log('PAGES noHash', JSON.stringify(noHash));
  console.log('PAGES withHash', JSON.stringify(withHash));
  await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/pages-after-back-with-hash.png' });
  expect.soft(withHash.afterBack, 'scroll position should be restored (~3500), not the anchor').toBeGreaterThan(3000);
});

test('app router: back button scroll restoration with and without hash', async ({ page }) => {
  const noHash = await run(page, 'app: test page WITHOUT hash', '#another');
  const withHash = await run(page, 'app: test page WITH hash', '#another');
  console.log('APP noHash', JSON.stringify(noHash));
  console.log('APP withHash', JSON.stringify(withHash));
  await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/app-after-back-with-hash.png' });
  expect.soft(withHash.afterBack, 'scroll position should be restored (~3500), not the anchor').toBeGreaterThan(3000);
});
