import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3000'
const shots = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
async function state(p, label) {
  const modal = await p.locator('#modal').count()
  const full = await p.locator('#full-page').count()
  console.log(`  ${label}: url=${p.url().replace(base,'')} modal=${modal} fullPage=${full}`)
  await p.screenshot({ path: `${shots}/${label.replace(/[^a-z0-9-]/gi,'_')}.png` })
}
for (const linkPrefix of ['photo', 'photoq']) {
  for (const start of ['/?example=21', '/']) {
    const name = `${linkPrefix}_start${start === '/' ? 'plain' : 'query'}`
    console.log(`== ${name}`)
    const p = await b.newPage()
    await p.goto(base + start); await p.waitForSelector('#home')
    await p.click(`#${linkPrefix}-1`); await p.waitForTimeout(1500)
    await state(p, `${name}-1-softnav`)
    await p.reload(); await p.waitForTimeout(1500)
    await state(p, `${name}-2-reload`)
    await p.goBack(); await p.waitForTimeout(1500)
    await state(p, `${name}-3-back`)
    await p.click(`#${linkPrefix}-2`); await p.waitForTimeout(2000)
    await state(p, `${name}-4-softnav-again`)
    await p.close()
  }
}
await b.close()
