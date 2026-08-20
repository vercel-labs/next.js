import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.env.BASE || 'http://localhost:3002'
const outDir = process.env.OUT || '.'
const browser = await chromium.launch()
const results = {}
for (const path of ['/', '/pages-router']) {
  const page = await browser.newPage()
  await page.emulateMedia({})
  const requests = []
  page.on('request', (r) => requests.push({ url: r.url(), t: Date.now() }))
  await page.goto(base + path, { waitUntil: 'load' })
  await page.waitForFunction('window.__thirdPartyEnd !== undefined && window.__hydrated !== undefined', null, { timeout: 15000 })
  const data = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const paints = Object.fromEntries(performance.getEntriesByType('paint').map(p => [p.name, Math.round(p.startTime)]))
    const tp = performance.getEntriesByType('resource').find(r => r.name.includes('slow-third-party'))
    return {
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      firstPaint: paints['first-paint'],
      firstContentfulPaint: paints['first-contentful-paint'],
      thirdPartyRequestStart: tp ? Math.round(tp.startTime) : null,
      thirdPartyExecStart: Math.round(window.__thirdPartyStart),
      thirdPartyExecEnd: Math.round(window.__thirdPartyEnd),
      hydrationMark: Math.round(window.__hydrated),
    }
  })
  results[path] = data
  await page.screenshot({ path: `${outDir}/screenshot${path === '/' ? '-app' : '-pages'}.png` })
  await page.close()
}
fs.writeFileSync(`${outDir}/measurements.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
await browser.close()
