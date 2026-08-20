import { chromium } from 'playwright'
import fs from 'node:fs'
const axeSource = fs.readFileSync('./node_modules/axe-core/axe.min.js', 'utf8')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
await page.goto('http://localhost:3122/', { waitUntil: 'load' })
await page.waitForTimeout(5000)
await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/next13-overlay.png' })
await page.addScriptTag({ content: axeSource })
const r = await page.evaluate(async () => {
  const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','best-practice'] } })
  return res.violations.map(v => ({ id: v.id, help: v.help, nodes: v.nodes.map(n => n.html.slice(0,160)) }))
})
console.log(JSON.stringify(r, null, 1).slice(0, 3000))
await browser.close()
