import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3010'
const out = process.env.OUT || 'dev'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 900, height: 700 } })
await p.goto(base + '/foo', { waitUntil: 'networkidle' })
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await new Promise(r => setTimeout(r, 500))
const before = await p.evaluate(() => window.scrollY)
await p.click('#trigger')
await p.waitForSelector('#nf')
await new Promise(r => setTimeout(r, 1000))
const after = await p.evaluate(() => window.scrollY)
const nfVisible = await p.locator('#nf').isVisible()
console.log(JSON.stringify({ mode: out, url: p.url(), scrollBeforeClick: before, scrollAfterNotFound: after, nfVisible }))
await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${out}-after-notfound.png`, fullPage: false })
await b.close()
