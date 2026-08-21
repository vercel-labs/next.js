// Stand-in for the "remote" endpoint (jsonplaceholder in the original report).
// Returns an incrementing counter so a cache HIT vs MISS is unambiguous.
const http = require('http')
let hits = 0
http
  .createServer((req, res) => {
    hits++
    res.setHeader('content-type', 'application/json')
    res.setHeader('cache-control', 'no-store')
    res.end(JSON.stringify({ originHits: hits, at: Date.now() }))
  })
  .listen(4000, () => console.log('origin server on http://localhost:4000'))
