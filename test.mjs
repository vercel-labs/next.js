import { chromium } from 'playwright'
const OUT = process.env.OUT || './artifacts'
const base = process.env.BASE || 'http://localhost:3000'
const tag = process.env.TAG || 'canary'
const variants = (process.env.VARIANTS || 'sticky,fixed,title,catchall').split(',')
const b = await chromium.launch()
const results = []
for (const variant of variants) {
  for (const kind of ['plain', 'hash']) {
    const p = await b.newPage({ viewport: { width: 900, height: 700 } })
    await p.goto(`${base}/${variant}/a`, { waitUntil: 'networkidle' })
    await p.evaluate(() => window.scrollTo(0, 2000))
    await p.waitForTimeout(300)
    const before = await p.evaluate(() => window.scrollY)
    await p.click(kind === 'hash' ? '#link-b-hash' : '#link-b')
    await p.waitForFunction(() => document.querySelector('#page-title')?.textContent?.includes('b'))
    await p.waitForTimeout(800)
    const after = await p.evaluate(() => window.scrollY)
    results.push({ variant, kind, before, after, scrollReset: after === 0 })
    await p.screenshot({ path: `${OUT}/${tag}-${variant}-${kind}-after-nav.png` })
    await p.close()
  }
}
console.log(JSON.stringify(results))
await b.close()
