import { chromium } from 'playwright'
const cases = {
  none: '',
  'pseudo-inherit': '::view-transition-old(root),::view-transition-new(root){direction:inherit}',
  'vt-root-ltr': '::view-transition{direction:ltr}',
  'html-ltr-body-rtl': 'HTMLDIR_LTR',
}
const b = await chromium.launch()
for (const [name, css] of Object.entries(cases)) {
  const p = await b.newPage({ viewport: { width: 800, height: 600 } })
  await p.goto('http://localhost:3001/a')
  if (css === 'HTMLDIR_LTR') {
    await p.evaluate(() => { document.documentElement.dir = 'ltr'; document.body.dir = 'rtl' })
  } else if (css) {
    await p.addStyleTag({ content: css })
  }
  await p.click('#to-b'); await p.waitForTimeout(600)
  const shot = await p.screenshot()
  const b64 = shot.toString('base64')
  const r = await p.evaluate(async b64 => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const cv = document.createElement('canvas'); cv.width = i.width; cv.height = i.height; const x = cv.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, i.width, i.height).data; let white = 0, tot = 0; for (let k = 0; k < d.length; k += 4) { tot++; if (d[k] > 250 && d[k+1] > 250 && d[k+2] > 250) white++ } return Math.round(100 * white / tot) }, b64)
  console.log(name, 'white % mid-transition =', r)
  await p.close()
}
await b.close()
