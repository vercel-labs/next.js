import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000/'
const b = await chromium.launch()
const p = await b.newPage()
const cdp = await p.context().newCDPSession(p)
const scripts = new Map()
cdp.on('Debugger.scriptParsed', e => scripts.set(e.scriptId, e))
const pauses = []
cdp.on('Debugger.paused', async e => { pauses.push(e) })
await cdp.send('Debugger.enable')
await cdp.send('Debugger.setSkipAllPauses', {skip: true})
await p.goto(base, {waitUntil: 'networkidle'}).catch(()=>{})
await new Promise(r=>setTimeout(r,2000))
let hit = null
for (const s of scripts.values()) {
  if (!s.url || !s.url.startsWith('http')) continue
  const {scriptSource} = await cdp.send('Debugger.getScriptSource', {scriptId: s.scriptId})
  const i = scriptSource.indexOf('__CLIENT_EFFECT_RAN')
  if (i >= 0) { const line = scriptSource.slice(0,i).split('\n').length - 1; hit = {...s, line}; break }
}
console.log('chunk:', hit.url, 'target line(gen):', hit.line)
const bp = await cdp.send('Debugger.setBreakpointByUrl', {url: hit.url, lineNumber: hit.line, columnNumber: 0})
console.log('breakpoint id', bp.breakpointId, 'resolved locations', JSON.stringify(bp.locations))
await cdp.send('Debugger.setSkipAllPauses', {skip: false})
p.reload({waitUntil: 'commit'}).catch(()=>{})
for (let i=0;i<24 && pauses.length<2;i++) await new Promise(r=>setTimeout(r,500))
for (const e of pauses) {
  const f = e.callFrames[0]
  const s = scripts.get(f.location.scriptId)
  console.log('PAUSE reason=%s hitBreakpoints=%s scriptUrl=%s line=%d fn=%s', e.reason, JSON.stringify(e.hitBreakpoints), (s&&s.url)||'(unknown)', f.location.lineNumber, f.functionName)
  await cdp.send('Debugger.resume').catch(()=>{})
  await new Promise(r=>setTimeout(r,800))
}
console.log('total pauses:', pauses.length)
await b.close()
