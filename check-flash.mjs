import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const out = process.argv[3] || 'run'
const bp = process.argv[4] ?? '/menu'
const link = (s) => `a[href="${bp}/category/${s}"]`
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(base + bp + '/', { waitUntil: 'networkidle' })
for (const s of ['pasta', 'salad', 'pizza']) {
  await p.click(link(s))
  await p.waitForFunction((s) => document.querySelector('#content')?.textContent === `Category: ${s}`, s)
}
await p.waitForTimeout(500)
await p.evaluate(() => {
  window.__log = []
  const snap = () => ({ t: Math.round(performance.now()), url: location.pathname, h1: document.querySelector('#content')?.textContent, title: document.title })
  window.__log.push(snap())
  new MutationObserver(() => {
    const s = snap()
    const last = window.__log[window.__log.length - 1]
    if (last.h1 !== s.h1 || last.title !== s.title || last.url !== s.url) window.__log.push(s)
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true })
})
await p.click(link('pizza')) // click Pizza while already on Pizza
await p.waitForTimeout(2000)
const log = await p.evaluate(() => window.__log)
await p.screenshot({ path: `./${out}-after.png` })
console.log(out + (log.length > 1 ? ' FLASH ' : ' stable ') + JSON.stringify(log))
await b.close()
