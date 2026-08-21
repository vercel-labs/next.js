// Emulates what an in-app WebView (e.g. KakaoTalk iOS INAPP browser) does to a page:
// it runs an injected script at document start that mutates the document before React hydrates.
// Run `npm run dev` (port 3000) and/or `npm run build && npm start` (port 3001) first, then:
//   URL=http://localhost:3000 node scripts/webview-hydration.mjs
import { webkit } from 'playwright'
import fs from 'node:fs'

const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1 KAKAOTALK/25.2.2 (INAPP)'

const variants = {
  none: ``,
  'html attribute': `document.documentElement.setAttribute('data-inapp','1')`,
  'body class': `document.body.classList.add('kakao-inapp')`,
  'extra text node': `document.body.insertBefore(document.createTextNode('inapp'), document.body.firstChild)`,
  'extra element in root': `(document.body.firstElementChild||document.body).prepend(Object.assign(document.createElement('span'),{id:'inapp',textContent:'x'}))`,
}

const url = process.env.URL || 'http://localhost:3000'
fs.mkdirSync('screenshots', { recursive: true })
const browser = await webkit.launch()

for (const [name, code] of Object.entries(variants)) {
  const ctx = await browser.newContext({
    userAgent: UA,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  await ctx.addInitScript((code) => {
    if (!code) return
    let done = false
    const inject = () => {
      if (done || !document.body) return
      done = true
      try {
        eval(code)
      } catch {}
    }
    new MutationObserver(inject).observe(document.documentElement || document, {
      childList: true,
      subtree: true,
    })
  }, code)
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]))
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push('console.error: ' + m.text().split('\n')[0])
  })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `screenshots/${name.replace(/\s/g, '-')}.png` })
  const hydration = errs.filter((e) => /ydrat|#418|#423|#425/.test(e))
  console.log(name.padEnd(22), '->', hydration[0] || 'no hydration error')
  await ctx.close()
}
await browser.close()
