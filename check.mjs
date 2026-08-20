import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const msgs = []
p.on('console', (m) => msgs.push(`[${m.type()}] ${m.text()}`))
await p.goto('http://localhost:3000/', { waitUntil: 'load' })
await p.waitForTimeout(2500)
for (const id of ['a', 'b', 'c']) {
  const info = await p.$eval(`#case-${id} img`, (img) => ({
    attrW: img.getAttribute('width'), attrH: img.getAttribute('height'),
    renderedW: img.width, renderedH: img.height,
    natural: `${img.naturalWidth}x${img.naturalHeight}`,
  }))
  console.log('case-' + id, JSON.stringify(info))
}
console.log('--- console messages ---')
console.log(msgs.filter(m=>!m.includes('Fast Refresh')).join('\n'))
await p.screenshot({ path: 'page.png', fullPage: true })
await b.close()
