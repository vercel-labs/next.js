import { chromium } from 'playwright'
const base = process.env.BASE_URL ?? 'http://localhost:3000'
const path = process.env.START_PATH ?? '/strict'
const browser = await chromium.launch()
console.log('chromium:', browser.version())
const page = await browser.newPage()
const consoleMsgs = []
page.on('console', (m) => {
  if (/Content Security Policy/i.test(m.text())) consoleMsgs.push(m.text())
})
await page.addInitScript(() => {
  window.__v = []
  document.addEventListener('securitypolicyviolation', (e) =>
    window.__v.push({ dir: e.effectiveDirective, blocked: e.blockedURI, src: e.sourceFile, line: e.lineNumber })
  )
})
await page.goto(base + path, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
const out = await page.evaluate(async () => {
  const res = { violationsBeforeProbe: window.__v.length }
  const d1 = document.createElement('div')
  document.body.appendChild(d1)
  d1.style.cssText = 'position:absolute;height:1px'
  res.cssText_attr = d1.style.cssText
  res.cssText_computedPosition = getComputedStyle(d1).position

  const d2 = document.createElement('div')
  document.body.appendChild(d2)
  d2.setAttribute('style', 'position:absolute;height:1px')
  res.setAttr_computedPosition = getComputedStyle(d2).position

  const d3 = document.createElement('div')
  document.body.appendChild(d3)
  d3.style.position = 'absolute'
  res.prop_computedPosition = getComputedStyle(d3).position

  await new Promise((r) => setTimeout(r, 500))
  res.violationsAfterProbe = window.__v
  return res
})
console.log(JSON.stringify(out, null, 2))
console.log('console CSP messages:', consoleMsgs.length)
for (const m of consoleMsgs.slice(0, 5)) console.log('  -', m.slice(0, 200))
await browser.close()
