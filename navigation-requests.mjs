import { chromium } from 'playwright'
const base = `http://localhost:${process.env.PORT}`
const b = await chromium.launch()
const page = await (await b.newContext()).newPage()
const ev=[]; let t0=Date.now()
page.on('request', r => { if (r.url().includes('_rsc')) ev.push(`  +${Date.now()-t0}ms REQUEST ${r.url().replace(base,'')}`) })
page.on('response', async r => { if (r.url().includes('_rsc')) ev.push(`  +${Date.now()-t0}ms RESPONSE ${r.status()} ${r.url().replace(base,'')}`) })
await page.goto(base,{waitUntil:'networkidle'}); await page.waitForTimeout(1500)
for (let i=1;i<=3;i++){
  ev.length=0; t0=Date.now()
  await page.click('#to-about'); await page.waitForSelector('#about')
  ev.push(`  +${Date.now()-t0}ms /about content rendered`)
  await page.waitForTimeout(1500)
  console.log(`click #${i} on <Link href="/about"> (static, prerendered):`); console.log(ev.join('\n')||'  (no _rsc requests)')
  ev.length=0; t0=Date.now(); await page.click('#to-home'); await page.waitForSelector('#home'); await page.waitForTimeout(1200)
}
await page.screenshot({path:'/workspace/.next-maintainer/reproduction-artifacts/playwright/rc0-about.png'})
await b.close()
