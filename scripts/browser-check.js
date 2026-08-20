const { chromium } = require('playwright')
const url = process.argv[2]; const tag = process.argv[3]
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage()
  const ev = []
  p.on('console', m => ev.push('CONSOLE ' + m.type() + ': ' + m.text()))
  p.on('pageerror', e => ev.push('PAGEERROR ' + e.message))
  p.on('requestfailed', r => ev.push('FAILED ' + r.url() + ' :: ' + (r.failure()||{}).errorText))
  p.on('request', r => ev.push('REQ ' + r.resourceType() + ' ' + r.url()))
  p.on('response', r => ev.push('RES ' + r.status() + ' ' + r.url()))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2500)
  const f1 = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].map(f=>f.family+':'+f.status) })
  await p.screenshot({ path: `./${tag}-home.png` })
  // client-side navigate
  const link = await p.$('a')
  if (link) { await link.click(); await p.waitForTimeout(3000) }
  const f2 = await p.evaluate(async () => { await document.fonts.ready; return { fonts: [...document.fonts].map(f=>f.family+':'+f.status), family: getComputedStyle(document.querySelector('p')).fontFamily } })
  await p.screenshot({ path: `./${tag}-bar.png` })
  console.log(JSON.stringify({ tag, fontsHome: f1, afterNav: f2, ev }, null, 2))
  await b.close()
})()
