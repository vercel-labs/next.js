import { chromium } from 'playwright'

const PORT = process.env.PORT || '3000'
const OUT = process.env.SHOT_DIR || '.'
const stats = () => fetch('http://127.0.0.1:4001/stats').then((r) => r.json())

const browser = await chromium.launch()
const page = await browser.newPage()

async function read(label) {
  const todos = (await page.textContent('#todos')).trim()
  const other = (await page.textContent('#other')).trim()
  const s = await stats()
  console.log(`${label}: ${todos} | ${other} | upstream hits=${JSON.stringify(s)}`)
  await page.screenshot({ path: `${OUT}/${label}.png` })
  return s
}

await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
await read('1-initial-load')
await page.reload({ waitUntil: 'networkidle' })
const beforeActions = await read('2-after-reload')

await page.click('#revalidate-todos')
await page.waitForTimeout(1500)
await read('3-after-server-action-1')
await page.click('#revalidate-todos')
await page.waitForTimeout(1500)
const afterActions = await read('4-after-server-action-2')

const extraOtherHits = (afterActions.other || 0) - (beforeActions.other || 0)
console.log('\n--- RESULT ---')
console.log(`upstream hits for the 'other-tag' fetch caused by 2 server actions: ${extraOtherHits}`)
console.log(
  extraOtherHits === 0
    ? "PASS: server action did not bypass the Data Cache of the unrelated 'other-tag' fetch"
    : "FAIL: server action re-fetched the unrelated 'other-tag' fetch (Data Cache bypassed)"
)
await browser.close()
process.exit(extraOtherHits === 0 ? 0 : 1)
