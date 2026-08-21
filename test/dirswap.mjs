import { chromium } from 'playwright'
const b = await chromium.launch()
const run = async (base, mutate, label) => {
  const p = await b.newPage({ viewport: { width: 800, height: 600 } })
  await p.goto(base + '/a')
  await p.evaluate(mutate)
  const dirs = await p.evaluate(() => [document.documentElement.getAttribute('dir'), document.body.getAttribute('dir'), getComputedStyle(document.documentElement).direction])
  await p.click('#to-b'); await p.waitForTimeout(600)
  const b64 = (await p.screenshot()).toString('base64')
  const white = await p.evaluate(async b64 => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const cv = document.createElement('canvas'); cv.width = i.width; cv.height = i.height; const x = cv.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, i.width, i.height).data; let w = 0, t = 0; for (let k = 0; k < d.length; k += 4) { t++; if (d[k] > 250 && d[k+1] > 250 && d[k+2] > 250) w++ } return Math.round(100 * w / t) }, b64)
  console.log(label, 'dirs=', JSON.stringify(dirs), 'white% =', white)
  await p.close()
}
await run('http://localhost:3001', () => {}, 'rtl-build as-is')
await run('http://localhost:3001', () => { document.documentElement.removeAttribute('dir'); document.body.removeAttribute('dir') }, 'rtl-build dir removed at runtime')
await run('http://localhost:3002', () => {}, 'ltr-build as-is')
await run('http://localhost:3002', () => { document.documentElement.dir = 'rtl' }, 'ltr-build dir=rtl at runtime')
await b.close()
