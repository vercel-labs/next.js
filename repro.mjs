// Deterministic reproduction for vercel/next.js#97036
// Sequence per round: click B (interrupt while the layout's Suspense chrome is
// still pending) -> click C -> history.back() -> history.forward()
// Each round leaves one MORE permanently-visible, never-resolving Suspense
// fallback ("SKELETON / spinner") on screen, with zero in-flight network.
import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const ROUNDS = Number(process.env.ROUNDS ?? 5)
const HEADLESS = process.env.HEADED !== '1'
const OUT = process.env.OUT ?? '.'

const browser = await chromium.launch({ headless: HEADLESS })
const ctx = await browser.newContext()
await ctx.addCookies([{ name: 'session', value: 'u1', url: BASE }])
const page = await ctx.newPage()
let inflight = 0
page.on('request', () => inflight++)
page.on('requestfinished', () => inflight--)
page.on('requestfailed', () => inflight--)

const probe = () =>
  page.evaluate(() => {
    const vis = (e) => !!(e.offsetParent || e.getClientRects().length)
    const all = [...document.querySelectorAll('[data-fallback="nav"]')]
    const sections = [...document.querySelectorAll('[data-section]')]
    return {
      stuckVisibleSkeletons: all.filter(vis).length,
      totalSkeletons: all.length,
      shells: sections.length,
      hiddenShells: sections.filter((e) => !vis(e)).length,
      path: location.pathname,
    }
  })

await page.goto(BASE + '/a', { waitUntil: 'networkidle' })
console.log('start:', JSON.stringify(await probe()))

for (let r = 0; r < ROUNDS; r++) {
  await page.click('#link-b')
  await page.waitForTimeout(250) // interrupt while chrome is suspended
  await page.click('#link-c', { force: true })
  await page.waitForTimeout(300)
  await page.goBack()
  await page.waitForTimeout(300)
  await page.goForward()
  await page.waitForTimeout(3000)
  console.log(`round ${r}:`, JSON.stringify(await probe()))
}

await page.waitForTimeout(20000) // prove it never resolves
const final = await probe()
console.log(`after +20s idle (in-flight requests: ${inflight}):`, JSON.stringify(final))
await page.screenshot({ path: `${OUT}/stuck.png`, fullPage: true })
await browser.close()

if (final.stuckVisibleSkeletons > 0) {
  console.log(`\nFAIL: ${final.stuckVisibleSkeletons} Suspense fallback(s) never resolved.`)
  process.exit(1)
}
console.log('\nPASS: no stuck fallbacks.')
