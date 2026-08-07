import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
fs.mkdirSync(OUT, { recursive: true })
const BASE = process.env.BASE || 'http://localhost:3001'
const log = []
const say = (s) => {
  console.log(s)
  log.push(s)
}

const browser = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell' })
const ctx = await browser.newContext()
const page = await ctx.newPage()

const requests = []
page.on('request', (r) =>
  requests.push({
    type: r.resourceType(),
    method: r.method(),
    url: r.url(),
    rsc: r.headers()['rsc'],
    action: r.headers()['next-action'] !== undefined,
  })
)
const consoleMsgs = []
page.on('console', (m) => consoleMsgs.push(`[console:${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => consoleMsgs.push(`[pageerror] ${e.message}`))

await page.goto(BASE + '/', { waitUntil: 'networkidle' })
say('--- loaded / (home) ---')

// 1. prefetch (hover the link) -> should be silent, no navigation
await page.hover('#to-other')
await page.waitForTimeout(1500)
const prefetches = requests.filter((r) => r.rsc !== undefined)
say(`prefetch requests seen with rsc header: ${prefetches.length}`)
say(`still on: ${page.url()} (home visible: ${await page.locator('#home').isVisible()})`)
await page.screenshot({ path: `${OUT}/01-after-challenged-prefetch.png` })

// 2. Server Action -> expect a throw
await page.click('#action')
await page.waitForTimeout(2500)
const actionState = await page.locator('#action-state').innerText()
say(`server action result: ${actionState}`)
const actionReqs = requests.filter((r) => r.action)
say(
  `server action request headers: ${JSON.stringify(
    actionReqs.map((r) => ({ method: r.method, rsc: r.rsc ?? '(absent)' }))
  )}`
)
await page.screenshot({ path: `${OUT}/02-after-challenged-server-action.png` })

// 3. Navigation -> expect MPA fallback (full document load of /other)
requests.length = 0
const navPromise = page
  .waitForNavigation({ waitUntil: 'load', timeout: 15000 })
  .catch(() => null)
await page.click('#to-other')
await navPromise
await page.waitForTimeout(1500)
say(`after clicking link, url = ${page.url()}`)
say(`challenge page shown: ${await page.locator('#challenge').count() > 0}`)
say(
  `document requests during navigation: ${JSON.stringify(
    requests.filter((r) => r.type === 'document').map((r) => r.url)
  )}`
)
await page.screenshot({ path: `${OUT}/03-after-challenged-navigation.png` })

say('--- browser console ---')
consoleMsgs.forEach(say)
fs.writeFileSync(`${OUT}/observations.txt`, log.join('\n') + '\n')
await browser.close()
