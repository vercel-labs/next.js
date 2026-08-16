const { test, expect } = require('@playwright/test')

// Clicks 4 same-path <Link>s that each fire a server action from onClick.
// Network latency is emulated (default 400ms) so that the same-path navigation
// dispatched by <Link> is still pending in the router action queue when the
// next click dispatches its server action.
test('every same-path Link click runs its server action', async ({ page, context }) => {
  const posts = []
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url())
  })

  await page.goto('/')
  await page.waitForTimeout(1500) // hydration

  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: Number(process.env.LATENCY || 400),
    downloadThroughput: 500 * 1024,
    uploadThroughput: 500 * 1024,
  })

  for (const id of ['1', '2', '3', '4']) {
    await page.click('#item-' + id)
    await page.waitForTimeout(Number(process.env.GAP || 200))
  }
  await page.waitForTimeout(6000)

  const log = await page.locator('#log').innerText()
  const settled = log.split('\n').filter((l) => l.startsWith('action settled')).length
  console.log('--- client log ---\n' + log)
  console.log('--- POST requests: ' + posts.length + ', settled actions: ' + settled)
  await page.screenshot({ path: 'playwright-report-final.png' })

  expect({ posts: posts.length, settled }).toEqual({ posts: 4, settled: 4 })
})
