// Usage: node verify.mjs [port]  (start `next build && next start` first)
import { chromium } from 'playwright'
const port = process.argv[2] || '3000'
const browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined, args: ['--no-sandbox'] })
const page = await browser.newPage()
page.on('response', (r) => {
  if (r.url().includes('/_next/data/')) console.log('[data]', r.status(), r.url())
})
await page.goto(`http://localhost:${port}/`)
await page.click('text=/profile')
await page.waitForTimeout(2000)
console.log('client-nav url  :', page.url())
console.log('client-nav props:', await page.locator('#props').textContent())
console.log('client-nav h2   :', await page.locator('#result').textContent())
await page.goto(`http://localhost:${port}/profile`)
console.log('hard-nav url    :', page.url())
console.log('hard-nav props  :', await page.locator('#props').textContent())
await browser.close()
