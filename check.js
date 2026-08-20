const { chromium } = require('playwright')
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 520, height: 1100 } })
  const reqs = []
  p.on('requestfailed', (r) => reqs.push(['failed', r.url()]))
  p.on('response', (r) => reqs.push([r.status(), r.url()]))
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(3000)
  await p.screenshot({ path: './placeholder-visible.png', fullPage: true })
  // measure rendered pixels of each placeholder by drawing the bg svg into canvas
  const info = await p.evaluate(async () => {
    const out = []
    for (const id of ['img-url', 'img-b64']) {
      const el = document.getElementById(id)
      const bg = getComputedStyle(el).backgroundImage
      const url = bg.slice(bg.indexOf('"') + 1, bg.lastIndexOf('"'))
      const res = await new Promise((r) => {
        const i = new Image()
        i.onload = () => {
          const c = document.createElement('canvas')
          c.width = 40; c.height = 40
          const ctx = c.getContext('2d')
          ctx.drawImage(i, 0, 0, 40, 40)
          const d = ctx.getImageData(0, 0, 40, 40).data
          let nonTransparent = 0
          for (let k = 3; k < d.length; k += 4) if (d[k] > 0) nonTransparent++
          r({ loaded: true, nonTransparentPixels: nonTransparent, total: 1600 })
        }
        i.onerror = () => r({ loaded: false })
        i.src = url
      })
      out.push({ id, hrefInSvg: decodeURIComponent(url).match(/href='([^']{0,60})/)[1], ...res })
    }
    return out
  })
  console.log(JSON.stringify(info, null, 2))
  console.log(JSON.stringify(reqs.filter(r => String(r[1]).includes('blur.png'))))
  await p.waitForTimeout(7000)
  await p.screenshot({ path: './after-load.png', fullPage: true })
  await b.close()
})()
