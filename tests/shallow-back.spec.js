const { test, expect } = require('@playwright/test')

test('browser back after shallow replace refetches getServerSideProps', async ({ page }) => {
  const dir = './test-results'

  // Step 1: navigate to /page1 (data fetch)
  await page.goto('/page1')
  const stamp1 = await page.locator('#stamp').innerText()

  // Step 2: shallow replace on page1
  await page.click('#shallow')
  await expect(page).toHaveURL('/page1?count=1')

  // Step 3: push to /page2
  await page.click('#next')
  await expect(page).toHaveURL('/page2')

  // Step 4: shallow replace on page2
  await page.click('#shallow')
  await expect(page).toHaveURL('/page2?count=1')

  const historyState = await page.evaluate(() => window.history.state)
  console.log('history.state before back:', JSON.stringify(historyState))

  // Step 5: browser back -> should land on /page1?count=1 with FRESH data
  await page.goBack()
  await expect(page).toHaveURL('/page1?count=1')
  await page.waitForTimeout(1500)

  const stampAfterBack = await page.locator('#stamp').innerText()
  console.log('stamp initial   :', stamp1)
  console.log('stamp after back:', stampAfterBack)
  await page.screenshot({ path: dir + '/after-back.png' })

  expect(stampAfterBack, 'getServerSideProps should have re-run on back navigation').not.toBe(stamp1)
})
