const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const OUT = process.env.ART || path.join(__dirname, 'artifacts')
const BASE = process.env.BASE || 'http://localhost:3001'

fs.mkdirSync(OUT, { recursive: true })
;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const logs = []
  page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`))
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

  await page.goto(BASE + '/', { waitUntil: 'load' })
  await page.waitForTimeout(6000)
  fs.writeFileSync(path.join(OUT, 'initial-body.html'), await page.content())
  await page.screenshot({ path: path.join(OUT, 'initial.png'), fullPage: true })

  // Fast Refresh: edit app/page.tsx and see whether the update is applied
  const pageFile = path.join(__dirname, 'app/page.tsx')
  const before = fs.readFileSync(pageFile, 'utf8')
  fs.writeFileSync(pageFile, before.replace('My page', 'My page EDITED'))
  await page.waitForTimeout(8000)
  const text = await page.evaluate(() => document.body.innerText)
  fs.writeFileSync(pageFile, before)
  await page.screenshot({ path: path.join(OUT, 'after-edit.png'), fullPage: true })
  fs.writeFileSync(path.join(OUT, 'after-edit-body.html'), await page.content())

  fs.writeFileSync(path.join(OUT, 'console.log'), logs.join('\n'))
  console.log('=== body text after edit ===')
  console.log(text)
  console.log('=== console/page errors ===')
  console.log(logs.join('\n'))
  await browser.close()
})()
