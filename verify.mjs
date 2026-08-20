// Reproduction attempt for https://github.com/vercel/next.js/issues/66660
// Steps: load /admin/about directly (hard load), then click the <Link href="/"> "Home" link.
// Reported bug: browser ends up on /admin/admin. Expected: /admin
import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage()

await page.goto(`${base}/admin/about`)
await page.waitForSelector('#h')
const href = await page.getAttribute('#home', 'href')
console.log('initial URL      :', page.url())
console.log('home link href   :', href)

await page.click('#home')
await page.waitForTimeout(3000)

const final = page.url()
console.log('URL after click  :', final)
console.log(
  final.endsWith('/admin/admin')
    ? 'RESULT: BUG REPRODUCED (double basePath)'
    : 'RESULT: no double basePath'
)
await browser.close()
