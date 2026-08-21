import { chromium } from 'playwright'
const url = process.argv[2]
const tag = process.argv[3]
const b = await chromium.launch()
const p = await (await b.newContext()).newPage()
const errs = [], logs = []
p.on('pageerror', e => errs.push('PAGEERROR: ' + (e.message||String(e)).split('\n')[0]))
p.on('console', m => { if (m.type()==='error') logs.push('CONSOLE: ' + m.text().split('\n')[0]) })
await p.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(e=>errs.push('GOTO: '+e.message))
await p.waitForTimeout(6000)
const canvas = await p.locator('#map canvas').count()
const html = await p.evaluate(()=>document.body.innerHTML.length)
console.log(JSON.stringify({ tag, canvasCount: canvas, bodyHtmlLen: html, errors: errs, consoleErrors: logs.slice(0,10) }, null, 2))
await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}.png`, fullPage: true })
await b.close()
