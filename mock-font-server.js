// Minimal stand-in for fonts.gstatic.com: answers with MOCK_STATUS (default 404)
// and counts hits, so "is the font file fetch retried?" is answered by observation.
const http = require('http')
const STATUS = Number(process.env.MOCK_STATUS || 404)
let hits = 0
const server = http.createServer((req, res) => {
  hits++
  console.log(`[mock-gstatic] request #${hits} ${req.method} ${req.url} -> ${STATUS}`)
  res.writeHead(STATUS, { 'content-type': 'text/plain' })
  res.end('nope')
})
server.listen(4949, '127.0.0.1', () => {
  console.log(`[mock-gstatic] listening on http://127.0.0.1:4949, answering ${STATUS}`)
})
const report = () => {
  console.log(`[mock-gstatic] total requests for the font file: ${hits}`)
  process.exit(0)
}
process.on('SIGTERM', report)
process.on('SIGINT', report)
