import { chromium, devices } from 'playwright'
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch({ headless: false })
const context = await browser.newContext({ ...devices['Pixel 7'] })
const page = await context.newPage()
await page.goto('http://localhost:3000')
await page.waitForTimeout(4000)
const state = () => page.evaluate(() => {
  const root = document.querySelector('nextjs-portal').shadowRoot
  const els = [...root.querySelectorAll('*')].filter(e => e.style.translate || e.classList.contains('dev-tools-grabbing'))
  const toast = root.querySelector('[data-nextjs-toast]')
  const r = toast.getBoundingClientRect()
  return {
    dragging: els.map(e => ({ tag: e.tagName, cls: e.className, translate: e.style.translate })),
    toastRect: { x: Math.round(r.x), y: Math.round(r.y) },
    bodyUserSelect: document.body.style.userSelect,
    scrollY: window.scrollY,
    evts: window.__evts || [],
  }
})
await page.evaluate(() => {
  const root = document.querySelector('nextjs-portal').shadowRoot
  window.__evts = []
  for (const t of ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture','click'])
    root.addEventListener(t, (e) => window.__evts.push(t + (t==='pointermove'?'':'')), true)
})
const before = await state(); console.log('BEFORE', JSON.stringify(before))
const cdp = await context.newCDPSession(page)
const tp=(x,y)=>[{x,y,radiusX:10,radiusY:10,force:1,id:1}]
const x0=before.toastRect.x+18, y0=before.toastRect.y+18
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:tp(x0,y0)})
for (let i=1;i<=15;i++){
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:tp(x0-i*2,y0-i*20)})
  await new Promise(r=>setTimeout(r,16))
  if(i===2||i===4) console.log('MID'+i, JSON.stringify(await state()))
}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
await page.waitForTimeout(2000)
console.log('AFTER', JSON.stringify(await state()))
await page.screenshot({path:`${OUT}/after-touch-drag.png`})
// tap the indicator: does the devtools panel open?
await page.touchscreen.tap(x0, y0)
await page.waitForTimeout(1500)
const panel = await page.evaluate(() => {
  const root = document.querySelector('nextjs-portal').shadowRoot
  return { panelOpen: !!root.querySelector('[data-nextjs-devtools-panel], [data-nextjs-dev-tools-menu], dialog[open]'), evts: window.__evts }
})
console.log('AFTER_TAP', JSON.stringify(panel), JSON.stringify(await state()))
await page.screenshot({path:`${OUT}/after-tap.png`})
await browser.close()
