import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext()
await ctx.addCookies([
  { name: 'app_session', value: 'user_1', domain: 'localhost', path: '/' },
])
const page = await ctx.newPage()
const reqs = []
page.on('request', (r) => {
  const u = new URL(r.url())
  if (u.pathname.startsWith('/_next/static')) return
  reqs.push(`${r.method()} ${u.pathname}${u.search} ${JSON.stringify(
    Object.fromEntries(
      Object.entries(r.headers()).filter(([k]) => k.startsWith('next-'))
    )
  )}`)
})
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
await page.screenshot({ path: `${OUT}/home.png`, fullPage: true })
fs.writeFileSync(`${OUT}/requests.txt`, reqs.join('\n') + '\n')
console.log(reqs.join('\n'))
await browser.close()
