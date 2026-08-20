import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
p.on('console', m => console.log('CONSOLE:', m.type(), m.text()))
p.on('pageerror', e => console.log('PAGEERROR:', e.message))
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
console.log('FORM HTML:', await p.locator('form').first().evaluate(el => el.outerHTML))
await p.screenshot({ path: './playwright-out/before.png' })
try { await p.click('button[type=submit]'); } catch(e){ console.log('CLICK ERR', e.message) }
await p.waitForTimeout(3000)
await p.screenshot({ path: './playwright-out/after.png', fullPage: true })
console.log('BODY TEXT:', (await p.locator('body').innerText()).slice(0,1500))
await b.close()
