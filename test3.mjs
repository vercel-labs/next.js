import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3000'
const shots='/workspace/.next-maintainer/reproduction-artifacts/playwright'
const tag = process.env.TAG || 'x'
const b = await chromium.launch()
const st = async (p,l) => { console.log(`  ${l}: url=${p.url().replace(base,'')} modal=${await p.locator('#modal').count()} full=${await p.locator('#full-page').count()}`); await p.screenshot({path:`${shots}/${tag}-${l}.png`}) }
// D: soft nav to set query, then soft nav to intercepted route
{
  console.log('== D: set query via soft nav, then click photo')
  const p = await b.newPage()
  await p.goto(base + '/'); await p.waitForSelector('#home')
  await p.click('#setq'); await p.waitForTimeout(1200); await st(p,'D-1-query-set')
  await p.click('#photo-1'); await p.waitForTimeout(2000); await st(p,'D-2-softnav')
  await p.close()
}
// E: D + reload + back + click
{
  console.log('== E: set query soft, click photo, reload, back, click photo')
  const p = await b.newPage()
  await p.goto(base + '/'); await p.waitForSelector('#home')
  await p.click('#setq'); await p.waitForTimeout(1200)
  await p.click('#photo-1'); await p.waitForTimeout(1500); await st(p,'E-1-softnav')
  await p.reload(); await p.waitForTimeout(1500); await st(p,'E-2-reload')
  await p.goBack(); await p.waitForTimeout(1500); await st(p,'E-3-back')
  await p.click('#photo-2'); await p.waitForTimeout(2000); await st(p,'E-4-softnav-again')
  await p.close()
}
await b.close()
