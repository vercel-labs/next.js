import { chromium } from 'playwright'
const base = process.argv[2]
const b = await chromium.launch(); const p = await b.newPage()
async function count(label) {
  const res = await p.evaluate(() => {
    const rules = []
    for (const s of document.styleSheets) {
      let rs; try { rs = s.cssRules } catch { continue }
      for (const r of rs) if (r.cssText && /font-size: ?20px/.test(r.cssText)) rules.push((s.href||'inline')+' => '+r.cssText)
    }
    return { rules, links: [...document.querySelectorAll('link[rel=stylesheet]')].map(l=>l.getAttribute('href')) }
  })
  console.log(`\n## ${label}: ${res.rules.length} matching rule(s)`)
  res.rules.forEach(r=>console.log('   ',r))
  console.log('  links:', res.links.join(', '))
}
await p.goto(base+'/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000); await count('initial load /')
for (const [text, label] of [['a','click -> /a'],['b','click -> /b'],['home','click -> /'],['a','click -> /a again'],['b','click -> /b again']]) {
  const link = p.locator(`a:has-text("${text}")`).first()
  if (await link.count() === 0) { console.log('no link', text); continue }
  await link.click(); await p.waitForTimeout(1200); await count(label)
}
await p.screenshot({ path: process.env.SHOT || '/workspace/.next-maintainer/reproduction-artifacts/playwright/nav.png' })
await b.close()
