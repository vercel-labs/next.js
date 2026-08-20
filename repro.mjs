import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3000'
const dir = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
const reqs = []
p.on('request', r => { if (r.url().startsWith(base)) reqs.push(r.method()+' '+r.url().replace(base,'')) })
async function step(sel, expect, label) {
  reqs.length = 0
  await p.click(sel)
  await p.waitForFunction(t => document.querySelector('#page')?.textContent === t, expect)
  await new Promise(r => setTimeout(r, 1500))
  console.log(`--- ${label} -> ${expect}: requests=${JSON.stringify(reqs)}`)
  await p.screenshot({ path: `${dir}/${label}.png` })
}
await p.goto(base)
await new Promise(r => setTimeout(r, 2000))
await step('#dashboard-link', 'Dashboard', '1-home-to-dashboard')
await step('#home-link', 'Home', '2-dashboard-to-home')
await step('#dashboard-link', 'Dashboard', '3-home-to-dashboard-again')
await step('#home-link', 'Home', '4-dashboard-to-home-again')
await b.close()
