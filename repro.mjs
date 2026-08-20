// Reproduces vercel/next.js#71842 without a browser.
// Requires: `npm run upstream` and `npm run dev` (or `npm run build && npm start`).
const base = process.env.BASE_URL || 'http://localhost:3001'
const HOST = process.env.UPSTREAM_ORIGIN || 'http://127.0.0.1:4001'
const nonce = Date.now() // avoid Next's on-disk image cache between runs
const opt = (u) => `${base}/_next/image?url=${encodeURIComponent(u)}&w=64&q=75`

async function check(label, upstream, { direct = true } = {}) {
  const t0 = Date.now()
  const res = await fetch(opt(upstream)).catch((e) => e)
  const body = res instanceof Error ? String(res) : (await res.text()).slice(0, 140)
  console.log(
    `${label} next/image  -> ${res.status ?? 'threw'} in ${Date.now() - t0}ms :: ${body.replace(/\s+/g, ' ')}`
  )
  if (direct) {
    const t1 = Date.now()
    const d = await fetch(upstream).catch((e) => e)
    console.log(
      `${label} direct/<img> -> ${d.status ?? 'threw'} in ${Date.now() - t1}ms`
    )
  }
  return res.status
}

// 1) upstream slower than the hard-coded 7s image fetch timeout
const slow = await check('[slow  ]', `${HOST}/slow.jpg?delay=8000&n=${nonce}`)
// 2) transient upstream socket error -> surfaces as an unhandled 500
const flaky = await check('[flaky ]', `${HOST}/flaky.jpg?n=${nonce}`, { direct: false })
// 3) sanity check: a healthy upstream image is optimized fine
const fast = await check('[fast  ]', `${HOST}/fast.jpg?n=${nonce}`)

console.log('')
if (fast === 200 && (slow !== 200 || flaky !== 200)) {
  console.log(
    `REPRODUCED: next/image returned ${slow} for the slow (8s) upstream and ${flaky} for the flaky upstream, while the plain image loads fine.`
  )
  process.exit(1)
}
console.log('NOT reproduced')
