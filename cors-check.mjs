import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const p = await b.newPage()
await p.goto('http://localhost:4000')
const out = await p.evaluate(async () => {
  const r = {}
  for (const u of ['http://127.0.0.1:3000/something', 'http://127.0.0.1:3000/something/']) {
    try { const res = await fetch(u); r[u] = 'ok ' + res.status }
    catch (e) { r[u] = 'FAILED: ' + e.message }
  }
  return r
})
console.log(out)
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/cors.png' })
await b.close()
