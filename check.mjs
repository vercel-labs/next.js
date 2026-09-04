import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const start = process.env.START_PATH ?? '/'
const nav = process.env.NAV_SELECTOR ?? 'a[href="/second"]'

const browser = await chromium.launch()
console.log('chromium:', browser.version())
const page = await browser.newPage()
const consoleViolations = []
page.on('console', (m) => {
  if (/Content Security Policy/i.test(m.text())) consoleViolations.push(m.text())
})
await page.addInitScript(() => {
  window.__cspViolations = []
  document.addEventListener('securitypolicyviolation', (e) => {
    window.__cspViolations.push({
      effectiveDirective: e.effectiveDirective,
      blockedURI: e.blockedURI,
      sourceFile: e.sourceFile,
      lineNumber: e.lineNumber,
      columnNumber: e.columnNumber,
    })
  })
})
await page.goto(base + start, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.click(nav)
await page.waitForTimeout(1500)

const result = await page.evaluate(() => {
  const c = document.getElementsByTagName('next-route-announcer')[0]
  const a = c?.shadowRoot?.childNodes[0]
  const rect = a?.getBoundingClientRect()
  return {
    violations: window.__cspViolations,
    containerExists: !!c,
    containerCssText: c ? c.style.cssText : null,
    announcerCssText: a ? a.style.cssText : null,
    announcerRect: rect ? { w: rect.width, h: rect.height } : null,
    announcerText: a ? a.textContent : null,
  }
})
console.log(JSON.stringify(result, null, 2))
console.log('console CSP messages:', consoleViolations.length)
for (const m of consoleViolations.slice(0, 4)) console.log('  -', m)
if (process.env.SCREENSHOT) {
  await page.screenshot({ path: process.env.SCREENSHOT, fullPage: true })
}
await browser.close()
