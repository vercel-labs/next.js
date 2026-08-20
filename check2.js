const { chromium } = require('playwright')
const fs = require('fs')
const ART = '/workspace/.next-maintainer/reproduction-artifacts'
const label = process.argv[2] || 'run'
async function run() {
  const b = await chromium.launch(); const page = await b.newPage()
  let loads = 0; page.on('load', () => loads++)
  const out = []
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
  async function cycle(name, file, mutate, waitFor) {
    await page.click('button')
    const before = await page.textContent('button')
    await page.evaluate(() => { window.__marker = 'kept' })
    const l0 = loads
    fs.writeFileSync(file, mutate(fs.readFileSync(file, 'utf8')))
    let ok = true
    try { await waitFor() } catch (e) { ok = false }
    await page.waitForTimeout(2000)
    const marker = await page.evaluate(() => window.__marker)
    const after = await page.textContent('button').catch(() => 'ERR')
    const line = `${name}: applied=${ok} marker=${marker} state ${before}->${after} loadEvents=${loads - l0} => ${marker === 'kept' ? 'FAST REFRESH' : 'FULL RELOAD'}`
    console.log(line); out.push(line)
  }
  for (let i = 2; i <= 4; i++) {
    await cycle(`server page edit #${i}`, 'app/page.js', s => s.replace(/Hello \d+/, 'Hello ' + i),
      () => page.waitForFunction(t => document.querySelector('#title')?.textContent === t, 'Hello ' + i, { timeout: 30000 }))
  }
  for (let i = 2; i <= 4; i++) {
    await cycle(`client component edit #${i}`, 'app/client.js', s => s.replace(/data-v="\d+"/, 'data-v="' + i + '"'),
      () => page.waitForFunction(v => document.querySelector('button')?.getAttribute('data-v') === String(v), i, { timeout: 30000 }))
  }
  for (let i = 2; i <= 4; i++) {
    await cycle(`globals.css edit #${i}`, 'app/globals.css', s => s.replace(/\/\* v\d+ \*\/\n?/, '') + `/* v${i} */\nbody { --v: ${i}; }\n`,
      () => page.waitForFunction(v => getComputedStyle(document.body).getPropertyValue('--v').trim() === String(v), i, { timeout: 30000 }))
  }
  fs.writeFileSync(`${ART}/playwright/${label}.txt`, out.join('\n') + '\n')
  await page.screenshot({ path: `${ART}/playwright/${label}.png` })
  await b.close()
}
run()
