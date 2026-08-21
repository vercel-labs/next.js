const base = process.env.BASE_URL ?? 'http://localhost:3000'

const cases = [
  { name: 'plain navigation', headers: {} },
  { name: 'Chrome preload / NoStatePrefetch (Purpose: prefetch)', headers: { Purpose: 'prefetch' } },
  { name: 'Chrome speculation prefetch (Sec-Purpose: prefetch)', headers: { 'Sec-Purpose': 'prefetch', Purpose: 'prefetch' } },
  { name: 'Chrome prerender (Sec-Purpose: prefetch;prerender)', headers: { 'Sec-Purpose': 'prefetch;prerender', Purpose: 'prefetch' } },
]

let failures = 0
for (const c of cases) {
  const res = await fetch(base + '/', { headers: { ...c.headers, 'User-Agent': 'Mozilla/5.0 Chrome/141' } })
  const csp = res.headers.get('content-security-policy')
  const body = await res.text()
  const hasNonce = /nonce="/.test(body)
  const ok = Boolean(csp) && hasNonce
  if (!ok) failures++
  console.log(`\n### ${c.name}`)
  console.log('  request headers      :', JSON.stringify(c.headers))
  console.log('  status               :', res.status)
  console.log('  Content-Security-Policy:', csp ?? '(MISSING)')
  console.log('  script nonce in HTML :', hasNonce)
  console.log('  result               :', ok ? 'OK' : 'BUG: proxy/middleware skipped, no CSP applied')
}
console.log(`\n${failures} of ${cases.length} request variants were served WITHOUT a CSP header.`)
