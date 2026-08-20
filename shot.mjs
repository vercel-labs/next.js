import { chromium } from 'playwright'
const b = await chromium.launch(); const p = await b.newPage()
const cdp = await p.context().newCDPSession(p)
await cdp.send('Debugger.enable'); await cdp.send('Debugger.setSkipAllPauses',{skip:true})
await p.goto(process.argv[2], {waitUntil:'networkidle'})
await p.screenshot({path: process.argv[3]}); await b.close()
