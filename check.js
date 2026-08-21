const { chromium } = require('playwright')
const OUT = './artifacts'
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage()
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(3000)
  const dump = async (label) => {
    const titles = await p.$$eval('title', els => els.map(e => e.textContent))
    const descs = await p.$$eval('meta[name="description"]', els => els.map(e => e.content))
    const headHtml = await p.$eval('head', e => e.innerHTML)
    console.log(label, JSON.stringify({ titles, descs }))
    return headHtml
  }
  await dump('after-mount-effect-action')
  await p.click('#btn'); await p.waitForTimeout(2500)
  await dump('after-manual-click-1')
  await p.click('#btn'); await p.waitForTimeout(2500)
  const head = await dump('after-manual-click-2')
  require('fs').mkdirSync('./artifacts',{recursive:true});require('fs').writeFileSync(OUT + '/head-after-actions.html', head)
  await p.screenshot({ path: OUT + '/page.png' })
  await b.close()
})()
