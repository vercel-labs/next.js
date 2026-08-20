const { chromium } = require('playwright')
;(async () => {
  const b = await chromium.launch({ headless: true})
  const p = await b.newPage()
  const reqs = []
  p.on('request', r => reqs.push({ m: r.method(), u: r.url(), rsc: r.headers()['rsc'], tree: r.headers()['next-router-state-tree'], type: r.resourceType() }))
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  console.log('--- after load, clicking #ext (absolute same-origin, prefetch=false, target=_self) ---')
  reqs.length = 0
  await p.click('#ext')
  await p.waitForTimeout(3000)
  for (const r of reqs) if (r.type === 'document' || r.rsc || r.u.includes('page-b')) console.log(JSON.stringify(r))
  console.log('final url:', p.url())
  console.log('body:', (await p.textContent('body')).trim().slice(0,200))
  await p.screenshot({ path: 'after-click-ext.png' })
  await b.close()
})()
