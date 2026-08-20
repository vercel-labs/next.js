const { chromium } = require('playwright')
const fs = require('fs')
const ART = '/workspace/.next-maintainer/reproduction-artifacts'
const label = process.argv[2] || 'run'
const PORT = process.env.PORT || 3000
const sizes = ['text-sm','text-lg','text-xl','text-2xl','text-3xl']
;(async () => {
  const b = await chromium.launch(); const page = await b.newPage()
  let loads = 0; page.on('load', () => loads++)
  const out = []
  await page.goto('http://localhost:' + PORT, { waitUntil: 'networkidle' })
  for (let i = 0; i < sizes.length; i++) {
    await page.click('button')
    const before = await page.textContent('button')
    await page.evaluate(() => { window.__marker = 'kept' })
    const l0 = loads
    // change a tailwind class in the client component -> new utility must be generated
    fs.writeFileSync('app/client.js', fs.readFileSync('app/client.js','utf8').replace(/text-(sm|lg|xl|2xl|3xl|blue-500)/, sizes[i]))
    let ok = true
    try {
      await page.waitForFunction(c => document.querySelector('button')?.className.includes(c), sizes[i], { timeout: 30000 })
    } catch (e) { ok = false }
    await page.waitForTimeout(2000)
    const marker = await page.evaluate(() => window.__marker)
    const after = await page.textContent('button').catch(()=> 'ERR')
    const fs_ = await page.evaluate(() => getComputedStyle(document.querySelector('button')).fontSize)
    const line = `tw class -> ${sizes[i]}: classApplied=${ok} computedFontSize=${fs_} marker=${marker} state ${before}->${after} loads=${loads-l0} => ${marker==='kept'?'no full reload':'FULL RELOAD'}`
    console.log(line); out.push(line)
  }
  fs.writeFileSync(`${ART}/playwright/${label}.txt`, out.join('\n')+'\n')
  await page.screenshot({ path: `${ART}/playwright/${label}.png` })
  await b.close()
})()
