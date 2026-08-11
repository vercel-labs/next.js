import { chromium } from 'playwright'
const url = process.argv[2]
const tag = process.argv[3]
const b = await chromium.launch()
const p = await b.newPage()
const reqs = []
p.on('response', async (r) => {
  const u = r.url()
  if (/\.(ttf|png|css)/.test(u)) reqs.push(`${r.status()} ${u}`)
})
await p.goto(url, { waitUntil: 'networkidle' })
await p.screenshot({ path: `./${tag}.png` })
console.log(`--- ${tag} (${url}) ---`)
console.log(reqs.join('\n'))
await b.close()
