import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const dir = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
for (const [u, name] of [['/','home'],['/sub','sub'],['/sub/throw','sub-throw'],['/nope','unmatched-root'],['/sub/missing','unmatched-sub']]) {
  const r = await p.goto(base+u, { waitUntil: 'domcontentloaded' })
  const txt = (await p.locator('body').innerText()).replace(/\s+/g,' ').slice(0,120)
  console.log(u, r.status(), '|', txt)
  await p.screenshot({ path: `${dir}/${base.includes('3001')?'prod':'dev'}-${name}.png` })
}
await b.close()
