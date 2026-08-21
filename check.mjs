import { chromium } from 'playwright'
const dir = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome', args: ['--autoplay-policy=no-user-gesture-required'] })
const p = await b.newPage()
const reqs = []
p.on('request', r => { if (/youtube|ytimg|jsdelivr/.test(r.url())) reqs.push(r.url()) })
await p.goto('http://localhost:3000', { waitUntil: 'load' })
await p.waitForTimeout(6000)
const report = await p.evaluate(() => {
  const q = id => {
    const root = document.getElementById(id)
    const lite = root.querySelector('lite-youtube')
    return {
      liteParams: lite?.getAttribute('params') ?? null,
      liteClass: lite?.className ?? null,
      iframeCount: root.querySelectorAll('iframe').length,
      iframeSrc: root.querySelector('iframe')?.getAttribute('src') ?? null,
    }
  }
  return {
    liteYoutubeDefined: !!customElements.get('lite-youtube'),
    autoplay: q('case-autoplay'),
    autoplayMute: q('case-autoplay-mute'),
    mutedProp: q('case-muted-prop'),
    mutedPropOuterHTML: document.getElementById('case-muted-prop').innerHTML,
    plain: q('case-plain'),
  }
})
console.log('BEFORE CLICK', JSON.stringify(report, null, 2))
await p.screenshot({ path: dir + '/01-on-load.png', fullPage: true })
// simulate user click on the first embed
await p.click('#case-autoplay lite-youtube')
await p.click('#case-autoplay-mute lite-youtube')
await p.waitForTimeout(4000)
const after = await p.evaluate(() => {
  const g = id => {
    const root = document.getElementById(id)
    const f = root.querySelector('iframe')
    return { iframeCount: root.querySelectorAll('iframe').length, iframeSrc: f?.getAttribute('src') ?? null }
  }
  return { autoplay: g('case-autoplay'), autoplayMute: g('case-autoplay-mute') }
})
console.log('AFTER CLICK case-autoplay', JSON.stringify(after))
await p.screenshot({ path: dir + '/02-after-click.png', fullPage: true })
console.log('yt/jsdelivr requests:', JSON.stringify([...new Set(reqs)], null, 2))
await b.close()
