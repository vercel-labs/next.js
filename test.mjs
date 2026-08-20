import { chromium } from 'playwright'
const url = process.argv[2] || 'http://localhost:3000/'
const tag = process.argv[3] || 'run'
const b = await chromium.launch()
const p = await b.newPage()
const resps = []
p.on('response', r => { if (r.request().method() === 'POST') resps.push(`${r.status()} ${r.url()}`) })
await p.goto(url)
await p.click('#run')
await p.waitForFunction(() => !['idle','running'].includes(document.querySelector('#out').textContent), null, { timeout: 20000 }).catch(()=>{})
const out = await p.textContent('#out')
console.log('OUT:', out)
console.log('POST responses:', resps.join(', '))
await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}.png` })
await b.close()
