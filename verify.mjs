import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const ctx = await b.newContext()
const page = await ctx.newPage()
const logs = []
page.on('console', m => logs.push(`[console:${m.type()}] ${m.text()}`))
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`))
page.on('response', async r => {
  if (r.request().method() === 'POST' || r.url().includes('login')) logs.push(`[net] ${r.request().method()} ${r.url()} -> ${r.status()} ${JSON.stringify(r.headers()['location']||'')}`)
})
// 1. get session cookie so dashboard is reachable
await ctx.addCookies([{name:'session', value:'valid', url:'http://localhost:3000'}])
await page.goto('http://localhost:3000/dashboard', {waitUntil:'load'})
logs.push('[step] on dashboard: ' + page.url())
// 2. call action WITH session
await page.click('#run-action')
await page.waitForTimeout(3000)
logs.push('[step] with session, state = ' + await page.textContent('#state'))
// 3. simulate expired session
await ctx.clearCookies()
await page.click('#run-action')
await page.waitForTimeout(5000)
logs.push('[step] after expiry, url = ' + page.url())
logs.push('[step] after expiry, state = ' + (await page.$('#state') ? await page.textContent('#state') : 'n/a'))
logs.push('[step] body text = ' + (await page.textContent('body')).slice(0,400).replace(/\n/g,' '))
await page.screenshot({path: OUT+'/after-action-with-expired-session.png', fullPage:true})
console.log(logs.join('\n'))
await b.close()
