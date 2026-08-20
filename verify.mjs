import { chromium } from 'playwright'
const base = process.argv[2]
const tag = process.argv[3]
const OUT = './screenshots'
const b = await chromium.launch()
const p = await b.newPage()
async function probe(label) {
  await p.waitForSelector('#shared')
  await p.waitForTimeout(700)
  const r = await p.evaluate(() => {
    const c = getComputedStyle(document.getElementById('shared'))
    return {
      bg: c.backgroundColor,
      padding: c.padding,
      fontSize: c.fontSize,
      css: [...document.querySelectorAll('link[rel=stylesheet],style')].map((n) =>
        n.tagName === 'LINK'
          ? 'LINK ' + n.getAttribute('href')
          : 'STYLE ' + n.textContent.replace(/\s+/g, ' ').slice(0, 200)
      ),
    }
  })
  console.log(`--- ${label}\n    bg=${r.bg} padding=${r.padding} fontSize=${r.fontSize}`)
  r.css.forEach((c) => console.log('     ', c))
  await p.screenshot({ path: `${OUT}/${tag}-${label}.png`, fullPage: true })
  return r
}
const cases = [
  ['vanilla-extract', '/a', '/b'],
  ['css-modules', '/c', '/d'],
]
const out = []
for (const [name, from, to] of cases) {
  await p.goto(base + to, { waitUntil: 'networkidle' })
  const direct = await probe(`${name}-${to.slice(1)}-direct-load`)
  await p.goto(base + from, { waitUntil: 'networkidle' })
  await p.waitForSelector('#shared')
  await p.click(`a[href="${to}"]`)
  const nav = await probe(`${name}-${to.slice(1)}-after-client-nav-from-${from.slice(1)}`)
  out.push([name, from, to, direct, nav])
}
console.log('\nRESULT (expected: identical computed styles)')
for (const [name, from, to, d, n] of out) {
  const ok = d.bg === n.bg && d.padding === n.padding && d.fontSize === n.fontSize
  console.log(
    `  ${name.padEnd(16)} ${to} direct=${d.bg}/${d.padding}  ${from}->${to} nav=${n.bg}/${n.padding}  => ${ok ? 'MATCH' : 'BROKEN'}`
  )
}
await b.close()
