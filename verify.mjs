import { chromium } from 'playwright'
const U = process.argv[2]
const out = process.argv[3]
const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' })
const p = await (await b.newContext()).newPage()
const reqs = []
p.on('response', r => { if (r.url().includes('/_next/data/')) reqs.push(`${r.status()} ${r.url()}`) })
await p.goto(U + '/', { waitUntil: 'networkidle' })
await p.click('#broken-link')
await p.waitForTimeout(4000)
console.log('URL after click:', p.url())
console.log('title:', await p.title())
console.log('h1/body text:', (await p.locator('body').innerText()).slice(0, 200).replace(/\n/g, ' | '))
console.log('data requests:', reqs.join('\n  '))
await p.screenshot({ path: out, fullPage: true })
await b.close()
