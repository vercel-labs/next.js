import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
console.log('before:', await p.textContent('#count'))
await p.click('button[type=submit]')
await p.waitForFunction(() => document.querySelector('#count')?.textContent !== 'count: 0', null, { timeout: 15000 })
console.log('after:', await p.textContent('#count'))
await b.close()
