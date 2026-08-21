import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const out = process.argv[3] || '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch({ headless: true })
const p = await b.newPage()
const errs = []
p.on('pageerror', e => errs.push('pageerror: ' + e.message))
p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()) })
const reqs = []
p.on('request', r => { if (r.url().includes('/_next/data/')) reqs.push(r.url()) })
await p.goto(base + '/hunder', { waitUntil: 'networkidle' })
const before = await p.locator('#stamp').innerText()
console.log('initial:', before, await p.locator('#props-status').innerText())
await p.locator('a').first().click()
await p.waitForURL('**/hunder/**')
await p.waitForLoadState('networkidle')
console.log('detail h1:', await p.locator('h1').innerText())
reqs.length = 0
await p.goBack({ waitUntil: 'load' })
await p.waitForTimeout(2500)
const html = await p.content()
console.log('after back URL:', p.url())
console.log('data requests during back:', JSON.stringify(reqs))
try { console.log('after back stamp:', await p.locator('#stamp').innerText()) } catch (e) { console.log('stamp missing') }
try { console.log('props-status:', await p.locator('#props-status').innerText()) } catch (e) { console.log('props-status missing') }
console.log('body snippet:', (await p.locator('body').innerText()).slice(0,300).replace(/\n/g,' | '))
console.log('errors:', JSON.stringify(errs, null, 1))
await p.screenshot({ path: out + '/after-back.png', fullPage: true })
await b.close()
