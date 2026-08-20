// Automated check (Firefox): types into #q (router.replace) and reports where focus ends up.
import { firefox } from 'playwright'

const url = process.argv[2] || 'http://localhost:3000'
const inputId = process.argv[3] || 'q' // use "q-native" for the history.replaceState control

const browser = await firefox.launch()
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.click(`#${inputId}`)
await page.keyboard.type('hello', { delay: 150 })
await page.waitForTimeout(1500)
const active = await page.evaluate(
  () => document.activeElement?.id || document.activeElement?.tagName
)
console.log(
  `input=#${inputId} activeElementAfterTyping=${active} value="${await page.inputValue(
    `#${inputId}`
  )}" url=${page.url()}`
)
console.log(active === inputId ? 'PASS: input kept focus' : 'FAIL: focus was stolen')
await browser.close()
process.exit(active === inputId ? 0 : 1)
