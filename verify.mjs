import { chromium } from 'playwright'
const OUT='.'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1000, height: 700 } })
for (const pre of [0, 1500]) for (const link of ['no-hash','with-hash']) {
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  if (pre) await p.evaluate(y => window.scrollTo(0, y), pre)
  await p.waitForTimeout(300)
  await p.click('#' + link)
  await p.waitForTimeout(1200)
  const s = await p.evaluate(() => ({ y: window.scrollY, headerVisible: (document.getElementById('layout-header').getBoundingClientRect().bottom > 0) }))
  console.log(`repro pre=${pre} ${link} -> ${p.url()} scrollY=${s.y} headerVisible=${s.headerVisible}`)
  await p.screenshot({ path: `${OUT}/repro-pre${pre}-${link}.png` })
}
await b.close()
