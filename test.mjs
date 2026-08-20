// Automated check for https://github.com/vercel/next.js/issues/73362
// Requires `npm run dev` (port 3000) running in another terminal.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
const failures = []
page.on('response', (r) => {
  if (r.status() >= 500) failures.push(`${r.status()} ${r.url()}`)
})

await page.goto('http://localhost:3000/does-not-exist', { waitUntil: 'networkidle' })
console.log('not-found page rendered:', await page.textContent('#nf'))
await page.click('#to-home')
await page.waitForTimeout(4000)
console.log('url after clicking link:', page.url())
console.log('5xx responses:', failures.length ? failures : 'none')
await browser.close()
process.exit(failures.length ? 1 : 0)
