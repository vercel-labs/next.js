// Upstream data source: increments a per-key counter on every *real* request,
// so any request that reaches it proves the Next.js Data Cache was bypassed.
const http = require('http')
const counters = {}
http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1')
    res.setHeader('content-type', 'application/json')
    if (url.pathname === '/stats') {
      res.end(JSON.stringify(counters))
      return
    }
    const key = url.searchParams.get('key') || 'default'
    counters[key] = (counters[key] || 0) + 1
    console.log(`[upstream] HIT key=${key} count=${counters[key]}`)
    res.end(JSON.stringify({ key, count: counters[key] }))
  })
  .listen(4001, () => console.log('[upstream] listening on 4001'))
