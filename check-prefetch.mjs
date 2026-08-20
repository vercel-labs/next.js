import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
const reqs = []
p.on('request', (r) => {
  const h = r.headers()
  if (r.url().includes('localhost:3000'))
    reqs.push({ url: r.url(), rsc: h['rsc'], nrp: h['next-router-prefetch'], purpose: h['purpose'], secpurpose: h['sec-purpose'] })
})
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
await p.screenshot({ path: './home.png' })
console.log(JSON.stringify(reqs, null, 2))
await b.close()
