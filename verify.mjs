import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const ctx = await b.newContext()
const page = await ctx.newPage()
const log = []
page.on('response', async (r) => {
  if (r.request().method() === 'POST') {
    log.push({ url: r.url(), status: r.status(), setCookie: (await r.headersArray()).filter(h=>h.name.toLowerCase()==='set-cookie') })
  }
})
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
console.log('before:', await page.textContent('#cookie-value'))
await page.click('#set')
await page.waitForTimeout(2500)
console.log('after action:', await page.textContent('#cookie-value'))
console.log('browser cookies:', (await ctx.cookies()).map(c=>`${c.name}=${c.value}`))
console.log('POST responses:', JSON.stringify(log, null, 2))
await page.screenshot({ path: OUT + '/after-action.png', fullPage: true })
await page.reload({ waitUntil: 'networkidle' })
console.log('after reload:', await page.textContent('#cookie-value'))
await page.screenshot({ path: OUT + '/after-reload.png', fullPage: true })
await b.close()
