import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE || 'http://localhost:3111'
const OUT = process.env.OUT_DIR || './axe-artifacts'
fs.mkdirSync(OUT, { recursive: true })
const axeSource = fs.readFileSync('./node_modules/axe-core/axe.min.js', 'utf8')
const browser = await chromium.launch()

async function check(route, name) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
  await page.goto(BASE + route, { waitUntil: 'load' })
  await page.waitForTimeout(4000)
  const portal = page.locator('nextjs-portal')
  const dialog = portal.locator('[role="dialog"]').first()
  if (!(await dialog.isVisible().catch(() => false))) {
    await portal.locator('[data-nextjs-toast]').first().click().catch(() => {})
  }
  await dialog.waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(OUT, `${name}-overlay.png`) })
  await page.addScriptTag({ content: axeSource })

  // 1. axe on the page as shipped
  const asShipped = await page.evaluate(async () => {
    const host = document.querySelector('nextjs-portal')
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })
    return {
      overlayHostParent: host.parentElement.nodeName,
      violations: r.violations.map((v) => v.id),
      overlayNodesSeenByAxe: [...r.violations, ...r.passes, ...r.incomplete].reduce(
        (acc, v) => acc + v.nodes.filter((n) => JSON.stringify(n.target).includes('nextjs-portal')).length, 0),
    }
  })

  // 2. manual accessible-name / heading audit of the overlay shadow tree
  const manual = await page.evaluate(() => {
    const sr = document.querySelector('nextjs-portal').shadowRoot
    const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    const name = (el) =>
      el.getAttribute('aria-label') ||
      el.getAttribute('title') ||
      el.innerText.trim() ||
      el.querySelector('svg > title')?.textContent?.trim() ||
      ''
    return {
      namelessVisibleButtons: [...sr.querySelectorAll('button')]
        .filter((b) => visible(b) && !name(b))
        .map((b) => b.outerHTML.slice(0, 220)),
      headings: [...sr.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(visible)
        .map((h) => `${h.tagName}: ${h.innerText.trim().slice(0, 40)}`),
    }
  })

  // 3. axe again after re-parenting the overlay host from <script> to <body>
  const unwrapped = await page.evaluate(async () => {
    const host = document.querySelector('nextjs-portal')
    document.body.appendChild(host)
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })
    return r.violations.map((v) => ({
      id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
      nodes: v.nodes.map((n) => ({ target: n.target, html: n.html.slice(0, 260) })),
    }))
  })

  fs.writeFileSync(path.join(OUT, `${name}-report.json`), JSON.stringify({ asShipped, manual, unwrapped }, null, 2))
  console.log(`\n===== ${name} (${route})`)
  console.log('overlay host parent element:', asShipped.overlayHostParent)
  console.log('axe (as shipped) violations:', asShipped.violations.join(', ') || 'none')
  console.log('overlay nodes evaluated by axe (as shipped):', asShipped.overlayNodesSeenByAxe)
  console.log('visible buttons in overlay with NO accessible name:', manual.namelessVisibleButtons.length)
  manual.namelessVisibleButtons.forEach((h) => console.log('   -', h.replace(/\n/g, ' ')))
  console.log('overlay heading order:', manual.headings.join(' | '))
  console.log('axe after re-parenting overlay out of <script>:')
  unwrapped.forEach((v) => {
    console.log(` #${v.id} (${v.impact}) ${v.help}`)
    v.nodes.forEach((n) => console.log('   -', JSON.stringify(n.target), n.html.replace(/\n/g, ' ').slice(0, 180)))
  })
  await page.close()
}

await check('/', 'runtime-error')
await check('/hydration', 'hydration-error')
await browser.close()
