import { chromium } from '@playwright/test'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(base)
await p.evaluate(() => {
  window.__log = []
  const t0 = performance.now()
  new MutationObserver((muts) => {
    for (const m of muts) {
      for (const n of m.removedNodes) if (n.nodeType===1) window.__log.push([Math.round(performance.now()-t0),'REMOVE',n.outerHTML])
      for (const n of m.addedNodes) if (n.nodeType===1) window.__log.push([Math.round(performance.now()-t0),'ADD',n.outerHTML])
      if (m.type==='characterData') window.__log.push([Math.round(performance.now()-t0),'TEXT',m.target.parentElement?.tagName+':'+m.target.data])
    }
  }).observe(document.head, {childList:true, subtree:true, characterData:true})
})
await p.click('a[href="/dynamic"]')
await p.waitForTimeout(4500)
const log = await p.evaluate(() => window.__log)
for (const l of log) if (!/script|link rel="(preload|prefetch|stylesheet)"/i.test(l[2]||'')) console.log(l.join(' '))
await b.close()
