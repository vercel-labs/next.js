import { chromium } from 'playwright'
const url = process.argv[2]
const out = process.argv[3]
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(url, { waitUntil: 'networkidle' })
const divs = await p.$$('body div')
for (const d of divs) {
  const t = (await d.innerText()).slice(0, 60).replace(/\n/g, ' ')
  const bg = await d.evaluate((e) => getComputedStyle(e).backgroundColor)
  console.log(JSON.stringify({ text: t, bg }))
}
const sheets = await p.evaluate(() => [...document.styleSheets].map(s => s.href))
console.log('sheets', sheets)
await p.screenshot({ path: out, fullPage: true })
await b.close()
