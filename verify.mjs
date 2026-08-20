import { chromium } from 'playwright'
const OUT='./screenshots'
const b = await chromium.launch(); const p = await b.newPage()
p.on('framenavigated', f => { if (f===p.mainFrame()) console.log('framenavigated', f.url()) })
for (const port of [Number(process.env.PORT ?? 3000)]) {
  await p.goto(`http://localhost:${port}/`)
  await p.evaluate(()=>{ window.__marker = 'alive' })
  await p.click('#add'); await p.click('#add')
  const s = await p.textContent('#server-value')
  await p.click('#redirect')
  await p.waitForFunction((s)=>document.querySelector('#server-value')&&document.querySelector('#server-value').textContent!==s, s, {timeout:15000})
  await p.screenshot({path: `${OUT}/${port}-after-redirect.png`})
  console.log(port, 'count:', await p.textContent('#client-count'), '| window marker:', await p.evaluate(()=>window.__marker ?? 'LOST (hard reload)'))
}
await b.close()
