import { test, expect } from '@playwright/test'

const messages: string[] = []

test('client navigation to external redirect logs failed RSC fetch', async ({ page }) => {
  page.on('console', (m) => messages.push(`[${m.type()}] ${m.text()}`))
  page.on('requestfailed', (r) =>
    messages.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`)
  )

  await page.goto('http://localhost:3000/')
  await page.click('#mw')
  await page.waitForTimeout(8000)
  console.log('--- middleware redirect ---')
  console.log(messages.join('\n'))
  console.log('final url:', page.url())

  messages.length = 0
  await page.goto('http://localhost:3000/')
  await page.click('#rsc')
  await page.waitForTimeout(8000)
  console.log('--- server component redirect() ---')
  console.log(messages.join('\n'))
  console.log('final url:', page.url())
})
