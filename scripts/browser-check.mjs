import { chromium } from 'playwright'
const base = process.argv[2]
const routes = process.argv.slice(3)
const b = await chromium.launch()
const errs = []
for (const r of routes) {
  const p = await b.newPage()
  p.on('console', m => { if (m.type()==='error') errs.push(r+' [console] '+m.text()) })
  p.on('pageerror', e => errs.push(r+' [pageerror] '+e.message))
  p.on('requestfailed', q => errs.push(r+' [reqfailed] '+q.url()+' :: '+q.failure()?.errorText))
  await p.goto(base+r, { waitUntil: 'networkidle' }).catch(e=>errs.push(r+' [goto] '+e.message))
  await p.waitForTimeout(1500)
  await p.close()
}
console.log(errs.length ? errs.join('\n') : 'NO ERRORS')
await b.close()
