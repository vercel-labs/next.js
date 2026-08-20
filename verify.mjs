// Run against a running `next start` server (default http://localhost:3000)
const base = process.argv[2] || 'http://localhost:3000'
for (const path of ['/', '/dynamic']) {
  const res = await fetch(base + path)
  const html = await res.text()
  const scripts = html.match(/<script[^>]*>/g) || []
  const withNonce = scripts.filter((s) => s.includes('nonce=')).length
  console.log(
    `${path}: CSP header=${res.headers.has('content-security-policy')} ` +
      `scripts=${scripts.length} withNonce=${withNonce}`
  )
}
