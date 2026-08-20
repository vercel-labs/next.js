// Loads the page in Chromium and prints the status of every /_next/data/ prefetch request.
import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const path = process.argv[3] || '/medicare/en/'
const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
const reqs = []
page.on('response', (r) => reqs.push(`${r.status()} ${r.request().method()} ${r.url()}`))
await page.goto(base + path, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
const data = reqs.filter((l) => l.includes('/_next/data/'))
console.log(data.length ? data.join('\n') : '(no /_next/data/ prefetch requests observed)')
await browser.close()
