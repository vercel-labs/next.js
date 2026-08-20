import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [name, url] of [['app-after','http://localhost:3000/after'],['pages-after','http://localhost:3000/after-pages']]) {
  const p = await b.newPage()
  await p.goto(url, { waitUntil: 'networkidle' })
  console.log(name, 'dupCount=', await p.evaluate(() => window.__dupCount ?? 0))
  await p.close()
}
await b.close()
