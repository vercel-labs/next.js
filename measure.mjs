import { chromium } from 'playwright'
const out = process.env.OUT || '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
for (const route of ['axes', 'no-axes']) {
  const p = await b.newPage({ viewport: { width: 900, height: 600 } })
  await p.goto('http://localhost:3000/' + route, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  const res = await p.evaluate(() => {
    const o = {}
    for (const id of ['a','b','c','d']) {
      const el = document.getElementById(id)
      const r = document.createRange(); r.selectNodeContents(el)
      const cs = getComputedStyle(el)
      o[id] = { textWidth: Math.round(r.getBoundingClientRect().width*100)/100, variation: cs.fontVariationSettings, stretch: cs.fontStretch }
    }
    return o
  })
  console.log(route, JSON.stringify(res))
  await p.screenshot({ path: `${out}/${route}.png`, fullPage: true })
  await p.close()
}
await b.close()
