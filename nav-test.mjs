import { chromium } from '@playwright/test'
const base = process.env.BASE || 'http://localhost:3000'
const label = process.env.LABEL || 'run'
const art = process.env.ARTIFACTS || '.'
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()
const docs = []
page.on('request', r => { if (r.resourceType() === 'document') docs.push(r.url()) })
let hardNav = 0
page.on('framenavigated', f => { if (f === page.mainFrame()) hardNav++ })
await page.goto(base + '/', { waitUntil: 'networkidle' })
const marker = 'MARKER_' + Date.now()
await page.evaluate(m => { window.__m = m }, marker)
console.log('docs after initial load:', JSON.stringify(docs))
await page.click('#to-x')
await page.waitForSelector('#x')
await page.waitForTimeout(1500)
const survived = await page.evaluate(() => window.__m)
console.log('docs total:', JSON.stringify(docs))
console.log('window state survived (soft nav):', survived === marker)
console.log('url:', page.url())
await page.screenshot({ path: `${art}/${label}-after-click.png` })
await browser.close()
