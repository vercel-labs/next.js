import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = process.env.ARTIFACTS || '.'

const active = (page) =>
  page.evaluate(() => {
    const el = document.activeElement
    if (!el) return 'null'
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${
      el.textContent && el.tagName !== 'BODY' ? ' "' + el.textContent.trim().slice(0, 40) + '"' : ''
    }`
  })

const browser = await chromium.launch()
const page = await browser.newPage()
const log = (...a) => console.log(...a)

// 1. client-side nav via next/link in a persistent layout (sidebar)
await page.goto(BASE + '/')
await page.click('#link-a')
await page.waitForSelector('#heading-a')
log('[1] after clicking sidebar <Link href="/a">     activeElement =', await active(page))

// 2. keyboard: Tab to sidebar link then Enter
await page.goto(BASE + '/')
await page.focus('#link-b')
await page.keyboard.press('Enter')
await page.waitForSelector('#heading-b')
log('[2] after keyboard Enter on sidebar link        activeElement =', await active(page))
const nextTab = await page.evaluate(async () => {
  return document.activeElement?.id || document.activeElement?.tagName
})
log('    (focus is still mid-page, after the nav)    id =', nextTab)

// 3. clicking a link that is removed from the DOM after navigation
await page.goto(BASE + '/')
await page.focus('#inline-link-a')
await page.keyboard.press('Enter')
await page.waitForSelector('#heading-a')
log('[3] link removed after nav                      activeElement =', await active(page))

// 4. baseline: real browser (MPA) navigation with a plain <a>
await page.goto(BASE + '/')
await page.evaluate(() => {
  const a = document.createElement('a')
  a.id = 'plain-a'
  a.href = '/a'
  a.textContent = 'plain anchor'
  document.body.appendChild(a)
})
await page.focus('#plain-a')
await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')])
await page.waitForSelector('#heading-a')
log('[4] baseline full page load (plain <a>)         activeElement =', await active(page))

await page.screenshot({ path: OUT + '/playwright/after-nav.png', fullPage: true })
await browser.close()
