import { chromium } from '@playwright/test'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(base)
await p.waitForTimeout(1500) // let client effect apply #ff0000
const tc = () => p.evaluate(() => document.querySelector('meta[name="theme-color"]')?.getAttribute('content') ?? 'ABSENT')
console.log('after hydration+client effect:', await tc())
await p.evaluate(() => { window.__s = []; const t0=performance.now();
  const tick=()=>{ const m=document.querySelector('meta[name="theme-color"]');
    window.__s.push([Math.round(performance.now()-t0), m?m.getAttribute('content'):'ABSENT', document.title||'EMPTY']);
    requestAnimationFrame(tick) }; tick() })
await p.click('a[href="/dynamic"]')
await p.waitForTimeout(4000)
const s = await p.evaluate(() => window.__s)
let prev=null
for (const x of s) { const k=x[1]+'|'+x[2]; if (k!==prev) { console.log('+'+x[0]+'ms theme-color='+x[1]+' title='+x[2]); prev=k } }
await p.screenshot({ path: (process.env.SHOT || '/workspace/.next-maintainer/reproduction-artifacts/playwright/nav.png') })
await b.close()
