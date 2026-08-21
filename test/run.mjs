import { firefox, chromium } from 'playwright'
import fs from 'node:fs'

const OUT = process.env.OUT_DIR || '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const DELAY = Number(process.env.CLICK_DELAY ?? 600)
const TARGET = process.env.TARGET || '#to-dashboard'

fs.mkdirSync(OUT, { recursive: true })

const BROWSER = process.env.BROWSER || 'firefox'
const browser = await (BROWSER === 'chromium' ? chromium : firefox).launch()
const ctx = await browser.newContext({ recordVideo: { dir: OUT + '/video' } })
const page = await ctx.newPage()
const logs = []
page.on('console', async (m) => {
  const args = []
  for (const a of m.args()) {
    try { args.push(await a.evaluate((v) => (v instanceof Error ? `${v.name}: ${v.message}` : typeof v === 'object' ? JSON.stringify(v) : String(v)))) } catch { args.push(m.text()) }
  }
  logs.push(`[console.${m.type()}] ${args.join(' ')}`)
})
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

if (process.env.DELAY_NAV) {
  // Slow down the outgoing navigation so any transient UI stays observable
  await page.route('**/dashboard', async (route) => {
    await new Promise((r) => setTimeout(r, Number(process.env.DELAY_NAV)))
    await route.continue()
  })
}

await page.addInitScript(() => {
  const check = () => {
    const el = document.querySelector('#error-boundary')
    if (el) console.log('ERROR_BOUNDARY_VISIBLE:' + el.textContent)
  }
  new MutationObserver(check).observe(document, { childList: true, subtree: true })
})

await page.goto(BASE, { waitUntil: 'load' })
await page.click('#submit')
await page.waitForFunction(() => document.querySelector('#status')?.textContent === 'loading...')
await page.waitForTimeout(DELAY)

let sawErrorBoundary = false
const watcher = (async () => {
  try {
    await page.waitForSelector('#error-boundary', { timeout: 6000 })
    sawErrorBoundary = true
    await page.screenshot({ path: `${OUT}/error-boundary-${BROWSER}-${TARGET.replace('#','')}.png` })
  } catch {}
})()

await page.click(TARGET).catch(() => {})
await watcher
await page.waitForTimeout(3000)
await page.screenshot({ path: `${OUT}/final-${BROWSER}-${TARGET.replace('#','')}.png` })

const result = {
  browser: BROWSER,
  target: TARGET,
  clickDelayMs: DELAY,
  sawErrorBoundary,
  finalUrl: page.url(),
  bodyText: (await page.locator('body').innerText()).slice(0, 300),
  logs,
}
console.log(JSON.stringify(result, null, 2))
fs.writeFileSync(`${OUT}/result-${BROWSER}-${TARGET.replace('#','')}.json`, JSON.stringify(result, null, 2))
await ctx.close()
await browser.close()
