import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const out = process.argv[3] || 'dev'
const b = await chromium.launch()
const p = await b.newPage()
for (const path of ['/group-dir', '/group-dir/trigger', '/group-dir/unmatched', '/unmatched']) {
  const res = await p.goto(base + path, { waitUntil: 'networkidle' })
  const text = (await p.locator('body').innerText()).replace(/\s+/g, ' ').trim()
  console.log(`${out} ${path} status=${res.status()} :: ${text.slice(0,200)}`)
  await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${out}${path.replace(/\//g,'_')}.png`, fullPage: true })
}
await b.close()
