import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage()
const mark = async (m) => { console.log('MARK', m, new Date().toISOString()) }
await p.goto(base + '/'); await p.waitForSelector('#run'); await p.waitForTimeout(3000)
await mark('A: click action, no nav')
await p.click('#run'); await p.waitForTimeout(3000)
console.log('state', await p.textContent('#state'))
await mark('B: navigate to /foo')
await p.click('#to-foo'); await p.waitForTimeout(2500)
await mark('C: goBack')
await p.goBack(); await p.waitForSelector('#run'); await p.waitForTimeout(3000)
await mark('D: click action after back')
await p.click('#run'); await p.waitForTimeout(4000)
await mark('E: done')
console.log('state', await p.textContent('#state'), JSON.stringify(await p.textContent('#log')))
await b.close()
