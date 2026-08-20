import { chromium } from 'playwright'
const port = process.env.PORT || '3000'
const label = process.env.LABEL || 'rewrite'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(`http://localhost:${port}/en`, { waitUntil: 'networkidle' })
await p.click('#link-vacancy')
await p.waitForTimeout(2500)
const body = await p.textContent('body')
console.log(label, 'url=', p.url())
console.log(label, 'body=', JSON.stringify(body))
console.log(label, 'modal?', body.includes('MODAL intercepted'), 'full?', body.includes('FULL PAGE'))
await p.screenshot({ path: `${out}/${label}-after-click.png`, fullPage: true })
await b.close()
