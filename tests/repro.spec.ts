import { test, expect, Page } from '@playwright/test';

const SHOT = './test-results';

test.beforeEach(async ({ page }) => {
  await page.request.post('/api/events'); // reset store
});

async function run(page: Page, newName: string, closeAfterMs: number) {
  await page.goto('/events');
  await expect(page.getByTestId('name-a')).toHaveText('Event A');
  await page.getByTestId('edit-a').click();
  await expect(page.getByTestId('name-input')).toBeVisible();
  await page.getByTestId('name-input').fill(newName);
  await page.waitForTimeout(closeAfterMs);
  await page.getByTestId('backdrop').click(); // "backdrop" -> router.push('/events')
  await expect(page.getByTestId('name-a')).toBeVisible();
  await page.waitForTimeout(4000); // debounce (2s) + action round trip
  const rendered = await page.getByTestId('name-a').textContent();
  const server = await (await page.request.get('/api/events')).text();
  console.log(`[closeAfter=${closeAfterMs}ms] rendered="${rendered}" server=${server}`);
  return rendered;
}

test('control: debounced action fires BEFORE navigating away -> list updates', async ({ page }) => {
  const rendered = await run(page, 'Control A', 2500);
  await page.screenshot({ path: `${SHOT}/control-after.png`, fullPage: true });
  expect(rendered).toBe('Control A');
});

test('bug: debounced action fires AFTER navigating away -> list stays stale', async ({ page }) => {
  const rendered = await run(page, 'Bug A', 300);
  await page.screenshot({ path: `${SHOT}/bug-after.png`, fullPage: true });
  expect(rendered).toBe('Bug A');
});
