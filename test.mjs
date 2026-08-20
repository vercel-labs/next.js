import { chromium } from 'playwright'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' })
for (const [name, url] of [['app-router','http://localhost:3000/'],['pages-router','http://localhost:3000/pages-router']]) {
  const p = await b.newPage()
  const logs = []
  p.on('console', m => logs.push(m.text()))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.waitForSelector('#box')
  await p.waitForTimeout(1500)
  logs.length = 0
  await p.mouse.move(5, 5)
  await p.hover('#box')
  await p.waitForTimeout(500)
  await p.screenshot({ path: `${out}/${name}.png` })
  console.log('=== ' + name + ' ===')
  console.log(logs.filter(l=>/mouseover|onMouseOver/i.test(l)).join('\n') || '(no relevant logs)')
  await p.close()
}
await b.close()
