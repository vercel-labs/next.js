import { chromium } from 'playwright'
import fs from 'fs'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = process.env.OUT || './playwright-out'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => { errors.push('pageerror: ' + e.message); console.log('PAGEERROR:', e.message) })
page.on('console', (m) => { if (['error','warning'].includes(m.type())) console.log(`console.${m.type()}:`, m.text().slice(0, 300)) })

await page.goto(BASE, { waitUntil: 'networkidle' })
console.log('1. loaded /, title=', await page.title())

await page.click('#to-erroring')
await page.waitForSelector('#to-home')
console.log('2. at /erroring-page, title=', JSON.stringify(await page.title()))

await page.goBack()
await page.waitForSelector('#to-erroring')
await page.waitForTimeout(500)
const announcer = await page.evaluate(() => {
  const c = document.getElementsByTagName('next-route-announcer')[0]
  return c?.shadowRoot?.innerHTML ?? '(no announcer)'
})
console.log('3. back at /, announcer shadow HTML:', announcer)

await page.click('#to-erroring')
await page.waitForTimeout(1500)
console.log('4. clicked to /erroring-page again')
const body = await page.evaluate(() => document.body.innerText.slice(0, 300))
console.log('body text now:', JSON.stringify(body))
await page.screenshot({ path: `${OUT}/after-second-nav.png`, fullPage: true })
console.log('ERRORS:', JSON.stringify(errors, null, 2))
await browser.close()
process.exit(errors.length ? 1 : 0)
