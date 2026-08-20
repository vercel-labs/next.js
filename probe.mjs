// Fires N concurrent requests at the rewritten (proxied) truncated endpoint,
// then measures whether the Next.js server can still answer plain page requests.
const NEXT = process.env.BASE || 'http://127.0.0.1:3000'
const N = Number(process.argv[2] || 20)

function timed(label, url, timeoutMs = 10000) {
  const t0 = Date.now()
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), timeoutMs)
  return fetch(url, { signal: ac.signal, cache: 'no-store' })
    .then(async (r) => {
      const buf = await r.arrayBuffer().catch((e) => ({ err: e }))
      return { label, ms: Date.now() - t0, status: r.status, bytes: buf.byteLength ?? -1, err: buf.err?.message }
    })
    .catch((e) => ({ label, ms: Date.now() - t0, err: e.name + ': ' + e.message }))
    .finally(() => clearTimeout(timer))
}

const baseline = await timed('baseline GET /', NEXT + '/')
console.log('BASELINE', JSON.stringify(baseline))

const proxied = await Promise.all(
  Array.from({ length: N }, (_, i) => timed('proxy #' + i, `${NEXT}/api/thumbnail?i=${i}`, 15000))
)
for (const p of proxied) console.log('PROXY', JSON.stringify(p))

for (let round = 1; round <= 6; round++) {
  const r = await timed('after GET / #' + round, NEXT + '/?r=' + round, 20000)
  console.log('AFTER', JSON.stringify(r))
}
