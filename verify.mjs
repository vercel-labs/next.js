import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE || 'http://localhost:3001' // through the simulated WAF
const b = await chromium.launch()
const ctx = await b.newContext({ recordVideo: { dir: OUT + '/video' } })
const page = await ctx.newPage()
const log = []
page.on('console', m => log.push(`[console.${m.type()}] ${m.text()}`))
page.on('pageerror', e => log.push(`[pageerror] ${e.message}`))
page.on('request', r => { const h = r.headers(); if (h.rsc || h['next-action']) log.push(`[req] ${r.method()} ${r.url()} rsc=${h.rsc ?? '-'} next-action=${h['next-action'] ? 'yes' : '-'} accept=${h.accept ?? '-'}`) })
page.on('response', r => { const h = r.request().headers(); if (h.rsc || h['next-action']) log.push(`[res] ${r.status()} ${r.url()} content-type=${r.headers()['content-type']}`) })

try {
await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => { window.__sameDocument = true })
log.push('--- home loaded; window.__sameDocument set; waiting 2.5s for prefetch of /protected ---')
await page.waitForTimeout(2500)
log.push(`PREFETCH: url=${page.url()} sameDocument=${await page.evaluate(() => window.__sameDocument === true)} homeVisible=${await page.locator('#home').isVisible()}`)
await page.screenshot({ path: OUT + '/1-prefetch-challenged-silent.png', fullPage: false, timeout: 8000, animations: 'disabled' }).catch(e => log.push("[screenshot failed] " + e.message))

log.push('--- clicking server action button ---')
await page.click('#action')
await page.waitForTimeout(2500)
log.push(`SERVER ACTION: ${await page.locator('#action-out').innerText()} | sameDocument=${await page.evaluate(() => window.__sameDocument === true)}`)
await page.screenshot({ path: OUT + '/2-server-action-throws.png', fullPage: false, timeout: 8000, animations: 'disabled' }).catch(e => log.push("[screenshot failed] " + e.message))

log.push('--- clicking Link to /protected (navigation path) ---')
await page.click('#to-protected')
await page.waitForTimeout(3000)
log.push(`NAVIGATION: url=${page.url()} sameDocument=${await page.evaluate(() => window.__sameDocument === true)} (false => hard/MPA navigation happened)`)
log.push(`body: ${(await page.locator('body').innerText()).slice(0, 200).replace(/\n/g, ' | ')}`)
await page.screenshot({ path: OUT + '/3-navigation-mpa-fallback.png', fullPage: false, timeout: 8000, animations: 'disabled' }).catch(e => log.push("[screenshot failed] " + e.message))

} catch (e) { log.push('[FATAL] ' + e.message.split('\n')[0]) }
console.log(log.join('\n'))
await ctx.close(); await b.close()
