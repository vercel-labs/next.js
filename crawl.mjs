const BASE = process.env.BASE || 'http://127.0.0.1:3000'
const N = Number(process.env.N || 3000)
const CONC = Number(process.env.CONC || 24)
const PREFIX = process.env.PREFIX || `r${Date.now()}`

async function mem(gc) {
  const r = await fetch(`${BASE}/api/mem${gc ? '?gc=1' : ''}`)
  return r.json()
}
let i = 0, ok = 0, bad = 0
async function worker() {
  while (true) {
    const n = i++
    if (n >= N) return
    const res = await fetch(`${BASE}/p/${PREFIX}-${n}`)
    await res.arrayBuffer()
    if (res.status === 200) ok++; else bad++
  }
}
console.log('start', JSON.stringify(await mem(true)))
const t0 = Date.now()
const rep = setInterval(async () => {
  console.log(`t=${((Date.now()-t0)/1000).toFixed(0)}s rendered=${ok}`, JSON.stringify(await mem(false)))
}, 15000)
await Promise.all(Array.from({length: CONC}, worker))
clearInterval(rep)
console.log(`done rendered=${ok} errors=${bad} in ${((Date.now()-t0)/1000).toFixed(0)}s`)
console.log('after traffic (no gc)', JSON.stringify(await mem(false)))
await new Promise(r => setTimeout(r, 10000))
console.log('idle 10s + forced gc', JSON.stringify(await mem(true)))
await new Promise(r => setTimeout(r, 20000))
console.log('idle 30s + forced gc', JSON.stringify(await mem(true)))
