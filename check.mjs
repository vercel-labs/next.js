import { chromium } from 'playwright'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
for (const [name, url] of [['app','http://localhost:3000/'],['pages','http://localhost:3000/pages-repro']]) {
  const p = await b.newPage()
  const logs = []
  p.on('console', m => logs.push(m.text()))
  await p.goto(url, { waitUntil: 'networkidle' })
  const count = await p.evaluate(() => window.__dupCount ?? 0)
  const tags = await p.evaluate(() => document.querySelectorAll('script[src="/counter.js"], script[src$="counter.js"]').length)
  console.log(`${name}: window.__dupCount=${count} scriptTagsInDOM=${tags}`)
  console.log(`${name} console:`, JSON.stringify(logs.filter(l=>l.includes('counter.js'))))
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  await p.close()
}
await b.close()
