import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await (await b.newContext()).newPage()
const nav = async (label) => {
  await p.click('text=go to /other'); await p.waitForSelector('text=back home')
  await p.click('text=back home'); await p.waitForSelector('#hits')
  console.log(label, await p.textContent('#hits'))
}
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
console.log('load', await p.textContent('#hits'))
await nav('nav t=0s ')
await new Promise(r => setTimeout(r, 35000))
await nav('nav t=35s')
await b.close()
