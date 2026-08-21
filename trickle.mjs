// Reporter's scenario: steady low-volume traffic (default 1 req/s), no forced GC.
const base = process.env.BASE ?? 'http://localhost:3000'
const intervalMs = Number(process.env.INTERVAL_MS ?? 1000)
const durationMs = Number(process.env.DURATION_MS ?? 180000)
const target = process.env.TARGET ?? '/api/ping'

const t0 = Date.now()
let n = 0
while (Date.now() - t0 < durationMs) {
  await fetch(base + target).then((r) => r.text())
  n++
  const r = await fetch(`${base}/api/monitor?gc=0`)
  console.log(
    Math.round((Date.now() - t0) / 1000) + 's',
    'requests=' + n,
    await r.text()
  )
  await new Promise((r) => setTimeout(r, intervalMs))
}
