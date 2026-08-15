import { chromium } from 'playwright'
const OUT='./screenshots'
const PORT=process.env.PORT||'3000'
const BASE=process.env.BASE||`http://localhost:${PORT}`
const HOME=process.env.HOME_PATH||'/'
const PRE=process.env.PRE||'r'
const b = await chromium.launch()
const p = await b.newPage()
const log=[]
async function step(name){ await p.waitForTimeout(2000); log.push(`${name}: url=${new URL(p.url()).pathname} title="${await p.title()}"`); await p.screenshot({path:`${OUT}/${PRE}-${name}.png`}) }
await p.goto(BASE+HOME); await step('01-home')
await p.click('#link-bitcoin'); await step('02-bitcoin')
await p.goBack(); await step('03-back')
await p.click('#link-ethereum'); await step('04-ethereum')
await p.goBack(); await step('05-back')
await p.click('#link-solana'); await step('06-solana')
console.log(log.join('\n'))
await b.close()
