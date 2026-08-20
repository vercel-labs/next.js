import { chromium } from 'playwright'
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto('http://localhost:3000/en')
await p.waitForSelector('#home')
// 1. link navigation
await p.click('#link-login')
await p.waitForSelector('#login')
console.log('after link click     URL =', p.url(), '| body =', (await p.textContent('#login')).trim())
await p.screenshot({path: OUT+'/link-nav.png'})
await p.goto('http://localhost:3000/en')
await p.waitForSelector('#home')
await p.click('#action-login')
await p.waitForSelector('#login')
await p.waitForTimeout(1000)
console.log('after server action  URL =', p.url(), '| body =', (await p.textContent('#login')).trim())
await p.screenshot({path: OUT+'/server-action-redirect.png'})
await b.close()
