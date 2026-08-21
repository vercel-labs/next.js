// Requests / against a running server and prints status + body.
const base = process.argv[2] || 'http://localhost:3000'
const t = Date.now()
const ctrl = new AbortController()
const timer = setTimeout(() => ctrl.abort(), 15000)
try {
  const res = await fetch(base + '/', { signal: ctrl.signal })
  const body = await res.text()
  console.log('status:', res.status, 'ms:', Date.now() - t)
  console.log('renders custom _error page:', body.includes('occurred on server'))
} catch (e) {
  console.log('HANG / failed after', Date.now() - t, 'ms:', e.message)
} finally {
  clearTimeout(timer)
}
