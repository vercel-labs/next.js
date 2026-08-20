import { chromium } from 'playwright'
import fs from 'node:fs'

const ART = process.env.ART_DIR || '/workspace/.next-maintainer/reproduction-artifacts/playwright'
fs.mkdirSync(ART, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()

const logs = []
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`))
page.on('response', (r) => {
  if (r.url().includes('/reviews')) {
    logs.push(`[network] ${r.status()} ${r.url()} fromServiceWorker=${r.fromServiceWorker()}`)
  }
})

await page.goto('http://localhost:3000/', { waitUntil: 'load' })
await page.waitForFunction(
  () => document.querySelector('#result')?.textContent !== 'pending',
  null,
  { timeout: 15000 }
)
const first = await page.textContent('#result')
await page.screenshot({ path: `${ART}/first-load.png` })

// Reload: now the service worker is already active from the previous visit.
await page.reload({ waitUntil: 'load' })
await page.waitForFunction(
  () => document.querySelector('#result')?.textContent !== 'pending',
  null,
  { timeout: 15000 }
)
const second = await page.textContent('#result')
await page.screenshot({ path: `${ART}/after-reload.png` })

// Control: the very same request, made after MSW finished starting, IS mocked.
const late = await page.evaluate(async () => {
  const res = await fetch('/reviews')
  return `status=${res.status} body=${(await res.text()).slice(0, 80)}`
})

const report = [
  'FIRST LOAD (fresh browser profile, no active service worker):',
  `  ${first}`,
  'AFTER RELOAD (service worker already registered):',
  `  ${second}`,
  '',
  'LATE FETCH (same URL, issued after MSW finished starting):',
  `  ${late}`,
  '',
  'Browser log:',
  ...logs.map((l) => `  ${l}`),
].join('\n')
fs.writeFileSync(`${ART}/report.txt`, report + '\n')
console.log(report)
await browser.close()
process.exit(first.includes('status=200') ? 1 : 0)
