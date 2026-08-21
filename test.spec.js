const { test, expect } = require('@playwright/test')

test('revalidateTag with an unrelated tag clears the client Router Cache', async ({
  page,
}) => {
  const posts = []
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url())
  })
  await page.goto('/')
  await page.click('#link-b')
  const first = await page.textContent('#rendered-at')
  await page.click('#link-home')
  await page.click('#link-b')
  const second = await page.textContent('#rendered-at')
  console.log('CONTROL: first=%s second=%s', first, second)
  expect(second).toBe(first)

  await page.click('#link-home')
  await page.waitForSelector('#revalidate')
  await Promise.all([
    page.waitForResponse((r) => r.request().method() === 'POST'),
    page.click('#revalidate'),
  ])
  await page.waitForTimeout(1500)
  console.log('server action POSTs:', posts)
  await page.click('#link-b')
  const third = await page.textContent('#rendered-at')
  console.log('AFTER revalidateTag: cached=%s now=%s', second, third)
  expect(third).toBe(second)
})
