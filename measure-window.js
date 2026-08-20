// Proves the dev bundler leaves its emitted manifests at zero bytes for a
// measurable window on every rebuild. Run against a warm dev server.
const fs = require('fs')
const DUR = Number(process.argv[2] || 30) * 1000
const files = [
  '.next/dev/build-manifest.json',
  '.next/dev/server/next-font-manifest.json',
  '.next/dev/server/app/page_client-reference-manifest.js',
  '.next/dev/server/app/pricing/page_client-reference-manifest.js',
]
const end = Date.now() + DUR
const state = new Map(files.map((f) => [f, { inZero: false, start: 0n, windows: [] }]))

let i = 0
const t = setInterval(() => {
  if (Date.now() >= end) return clearInterval(t)
  fs.appendFileSync('app/counter.jsx', `\n// rebuild ${++i}\n`)
}, 250)

function spin() {
  while (Date.now() < end) {
    for (const f of files) {
      const s = state.get(f)
      let zero = false
      try { zero = fs.statSync(f).size === 0 } catch { continue }
      const now = process.hrtime.bigint()
      if (zero && !s.inZero) { s.inZero = true; s.start = now }
      else if (!zero && s.inZero) { s.inZero = false; s.windows.push(Number(now - s.start) / 1e6) }
    }
  }
  for (const [f, s] of state) {
    const w = s.windows.sort((a, b) => a - b)
    if (!w.length) { console.log(`${f}: no zero-byte window observed`); continue }
    const sum = w.reduce((a, b) => a + b, 0)
    console.log(`${f}: ${w.length} zero-byte windows, min ${w[0].toFixed(2)}ms p50 ${w[Math.floor(w.length / 2)].toFixed(2)}ms max ${w[w.length - 1].toFixed(2)}ms, ${((sum / DUR) * 100).toFixed(2)}% of wall time`)
  }
}
spin()
