// Minimal "GraphQL" endpoint: every POST returns an incrementing counter,
// so any caching by Next.js is immediately visible.
import { createServer } from 'node:http'
let hits = 0
createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    hits++
    console.log(`[graphql] hit #${hits} ${req.method} auth=${req.headers.authorization ?? '-'} body=${body.slice(0, 80)}`)
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ data: { hits, now: new Date().toISOString() } }))
  })
}).listen(4000, () => console.log('graphql upstream on :4000'))
