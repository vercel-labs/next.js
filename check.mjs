import { chromium } from 'playwright'
const dir = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
const page = await browser.newPage()
const msgs = []
page.on('console', m => msgs.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`))
await page.goto('http://localhost:3002/', { waitUntil: 'load' })
await page.waitForTimeout(2500)
console.log('hydrated text:', await page.locator('#hydrated').textContent())
await page.click('#inc').catch(()=>{})
await page.waitForTimeout(500)
console.log('button text after click:', await page.locator('#inc').textContent())
console.log('--- console ---')
console.log(msgs.slice(0, 12).join('\n'))
await page.screenshot({ path: `${dir}/static-page-csp-blocked.png`, fullPage: true })
await browser.close()
