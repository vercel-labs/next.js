const { test, expect } = require('@playwright/test')

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const ITER = Number(process.env.ITER || 24)
const JS_DELAY = Number(process.env.JS_DELAY || 400)

test('back button during a slow reload renders stale segment', async ({ page, context }) => {
  // widen the reported race window: hydration JS arrives late, back is pressed meanwhile
  await context.route('**/_next/static/**', async (route) => {
    await new Promise((r) => setTimeout(r, JS_DELAY))
    await route.continue()
  })
  const results = []
  for (let i = 0; i < ITER; i++) {
    const delay = 50 + (i % 12) * 50
    await page.goto(BASE + '/page1', { waitUntil: 'load' })
    await page.click('#link2')
    await expect(page.locator('#content')).toHaveText('page2')

    page.evaluate(() => location.reload()).catch(() => {})
    await new Promise((r) => setTimeout(r, delay))
    await page.goBack({ waitUntil: 'commit' }).catch(() => {})
    await new Promise((r) => setTimeout(r, 3000))

    const url = new URL(page.url()).pathname
    let content = null
    try { content = await page.textContent('#content', { timeout: 3000 }) } catch {}
    const bad = content && content !== url.slice(1)
    results.push({ delay, url, content, bad })
    if (bad) await page.screenshot({ path: `stale-${delay}ms.png` })
  }
  const bad = results.filter((r) => r.bad)
  console.log('BASE', BASE, 'JS_DELAY', JS_DELAY, 'mismatches', bad.length, '/', results.length)
  console.log(JSON.stringify(results))
  expect(bad, 'stale segment occurrences').toHaveLength(0)
})
