// Usage: node verify.mjs http://localhost:3000
import { chromium } from 'playwright'

const base = process.argv[2] ?? 'http://localhost:3000'
const routes = [
  '/',
  '/client-title-static',
  '/client-title?language=fr',
  '/document-title?language=fr',
]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const route of routes) {
  const res = await page.goto(base + route, { waitUntil: 'load' })
  const html = await (await fetch(base + route)).text()
  await page.waitForTimeout(1500)
  console.log(
    route,
    '| status', res.status(),
    '| <title> in HTML:', JSON.stringify(html.match(/<title>[^<]*<\/title>/g)),
    '| document.title after hydration:', JSON.stringify(await page.title())
  )
}
await page.goto(base + '/')
await page.getByRole('link', { name: /document\.title/ }).click()
await page.waitForTimeout(1500)
console.log('client-side nav to /document-title | document.title:', JSON.stringify(await page.title()))
await browser.close()
