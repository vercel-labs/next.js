import { chromium } from 'playwright'
const base = process.env.BASE_URL ?? 'http://localhost:3001'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] })
console.log('chromium:', browser.version())
const page = await browser.newPage()
await page.addInitScript(() => {
  window.__v = []
  document.addEventListener('securitypolicyviolation', (e) =>
    window.__v.push({ dir: e.effectiveDirective, blocked: e.blockedURI, src: e.sourceFile, line: e.lineNumber })
  )
})
await page.goto(base + (process.env.START_PATH ?? '/'), { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
const out = await page.evaluate(() => {
  const c = document.getElementsByTagName('next-route-announcer')[0]
  const a = c?.shadowRoot?.childNodes[0]
  const byDir = {}
  for (const v of window.__v) byDir[v.dir] = (byDir[v.dir] ?? 0) + 1
  return {
    announcerCssText: a ? a.style.cssText : null,
    announcerComputedPosition: a ? getComputedStyle(a).position : null,
    byDirective: byDir,
    sample: window.__v.slice(0, 3),
    inlineStyleEls: [...document.querySelectorAll('style')].length,
    inlineStyleElsWithoutNonce: [...document.querySelectorAll('style')].filter((s) => !s.nonce).length,
  }
})
console.log(JSON.stringify(out, null, 2))
await browser.close()
