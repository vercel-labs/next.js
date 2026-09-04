import { chromium } from 'playwright'
const base = 'http://localhost:3000'
const path = process.env.START_PATH ?? '/strict'
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--no-sandbox'],
})
console.log('chromium:', browser.version())
const page = await browser.newPage()
const consoleMsgs = []
page.on('console', (m) => {
  if (/Content Security Policy/i.test(m.text())) consoleMsgs.push(m.text())
})
await page.addInitScript(() => {
  window.__v = []
  document.addEventListener('securitypolicyviolation', (e) =>
    window.__v.push({ dir: e.effectiveDirective, blocked: e.blockedURI, line: e.lineNumber })
  )
})
await page.goto(base + path, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const out = await page.evaluate(async () => {
  const res = {}
  const c = document.getElementsByTagName('next-route-announcer')[0]
  const a = c?.shadowRoot?.childNodes[0]
  res.announcerExists = !!a
  res.announcerCssText = a ? a.style.cssText : null
  res.announcerComputedPosition = a ? getComputedStyle(a).position : null
  const d1 = document.createElement('div')
  document.body.appendChild(d1)
  d1.style.cssText = 'position:absolute;height:1px'
  res.probe_cssText_computedPosition = getComputedStyle(d1).position
  const d2 = document.createElement('div')
  document.body.appendChild(d2)
  d2.setAttribute('style', 'position:absolute')
  res.probe_setAttr_computedPosition = getComputedStyle(d2).position
  await new Promise((r) => setTimeout(r, 500))
  res.violations = window.__v
  return res
})
console.log(JSON.stringify(out, null, 2))
console.log('console CSP messages:', consoleMsgs.length)
for (const m of consoleMsgs.slice(0, 4)) console.log('  -', m.slice(0, 220))
await browser.close()
