import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 800 } })
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await p.waitForTimeout(2000)
// open dev tools indicator
await p.locator('[data-nextjs-dev-tools-button]').click()
await p.waitForTimeout(500)
await p.locator('[role="menuitem"]', { hasText: 'Preferences' }).click()
await p.waitForTimeout(800)
await p.screenshot({ path: `${OUT}/01-preferences-panel.png` })

const info = await p.evaluate(() => {
  const portal = document.querySelector('nextjs-portal')
  const root = portal.shadowRoot
  const out = []
  for (const wrap of root.querySelectorAll('.select-button')) {
    const sel = wrap.querySelector('select')
    const wb = wrap.getBoundingClientRect()
    const sb = sel.getBoundingClientRect()
    const probe = (x, y) => {
      const el = root.elementFromPoint(x, y)
      return el ? el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className : '') : 'null'
    }
    out.push({
      label: sel.value,
      wrapper: { x: wb.x, y: wb.y, w: wb.width, h: wb.height },
      select: { x: sb.x, y: sb.y, w: sb.width, h: sb.height },
      hitLeftPadding: probe(wb.x + 2, wb.y + wb.height / 2),
      hitSelectText: probe(sb.x + sb.width / 2, sb.y + sb.height / 2),
      hitChevron: probe(wb.right - 8, wb.y + wb.height / 2),
      hitTopEdge: probe(wb.x + wb.width / 2, wb.y + 2),
      selectPoints: { chevronX: wb.right - 8, y: wb.y + wb.height / 2, textX: sb.x + sb.width/2 },
    })
  }
  return out
})
console.log(JSON.stringify(info, null, 2))

// focus test: click chevron area vs select text
const activeTag = async () => p.evaluate(() => {
  const r = document.querySelector('nextjs-portal').shadowRoot
  const a = r.activeElement
  return a ? a.tagName.toLowerCase() + '|' + (a.value ?? '') : 'none'
})
const first = info[0]
await p.evaluate(() => document.querySelector('nextjs-portal').shadowRoot.activeElement?.blur())
await p.mouse.click(first.selectPoints.chevronX, first.selectPoints.y)
await p.waitForTimeout(300)
console.log('after click on chevron/right padding, shadow activeElement =', await activeTag())
await p.screenshot({ path: `${OUT}/02-after-click-chevron.png` })
await p.mouse.click(first.selectPoints.textX, first.selectPoints.y)
await p.waitForTimeout(300)
console.log('after click on select text, shadow activeElement =', await activeTag())
await p.screenshot({ path: `${OUT}/03-after-click-text.png` })
await b.close()
