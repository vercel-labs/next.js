import { chromium } from 'playwright'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await (await b.newContext()).newPage()
const msgs = []
p.on('console', m => msgs.push(`[${m.type()}] ${m.text().slice(0,300)}`))
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
const attrs = await p.$$eval('img', els => els.map(e => ({ id: e.id, outer: e.outerHTML.slice(0, 200), blurwidth: e.getAttribute('blurwidth'), blurheight: e.getAttribute('blurheight') })))
console.log(JSON.stringify(attrs, null, 2))
console.log('CONSOLE:\n' + msgs.filter(m=>/blur/i.test(m)).join('\n'))
await p.screenshot({ path: out + '/index.png', fullPage: true })
await b.close()
