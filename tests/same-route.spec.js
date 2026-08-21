const { test, expect } = require('@playwright/test')

const nav = (page, method, url, opts) =>
  page.evaluate(([m, u, o]) => window.next.router[m](u, undefined, o), [method, url, opts])

test('back to a shallow-replaced same-route entry skips getServerSideProps', async ({ page }) => {
  const dir = './test-results'
  const dataReqs = []
  page.on('request', (r) => {
    if (r.url().includes('/_next/data/')) dataReqs.push(r.url())
  })

  await page.goto('/page1')
  const stampInitial = await page.locator('#stamp').innerText()

  // Step 2: shallow replace -> entry A recorded with { shallow: true }
  await nav(page, 'replace', '/page1?count=1', { shallow: true })
  await expect(page).toHaveURL('/page1?count=1')

  // Step 3: normal push to same route, different query -> real fetch
  await nav(page, 'push', '/page1?count=2')
  await expect(page).toHaveURL('/page1?count=2')
  await page.waitForTimeout(500)
  const stampB = await page.locator('#stamp').innerText()
  expect(stampB).not.toBe(stampInitial)

  // Step 4: shallow replace on current entry
  await nav(page, 'replace', '/page1?count=3', { shallow: true })
  await expect(page).toHaveURL('/page1?count=3')

  const before = dataReqs.length
  // Step 5: browser back -> /page1?count=1 (entry A, shallow flag still in history state)
  await page.goBack()
  await expect(page).toHaveURL('/page1?count=1')
  await page.waitForTimeout(1500)

  const stampAfterBack = await page.locator('#stamp').innerText()
  const query = await page.locator('#query').innerText()
  console.log('history.state after back:', JSON.stringify(await page.evaluate(() => window.history.state)))
  console.log('stamp initial /page1        :', stampInitial)
  console.log('stamp for   /page1?count=2  :', stampB)
  console.log('stamp after back to count=1 :', stampAfterBack, ' query:', query)
  console.log('data requests during back   :', dataReqs.length - before)
  await page.screenshot({ path: dir + '/same-route-after-back.png' })

  expect(
    dataReqs.length - before,
    'back navigation to /page1?count=1 should trigger a getServerSideProps data request'
  ).toBeGreaterThan(0)
})
