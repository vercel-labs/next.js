// Minimal stand-in for the reporter's FastAPI StreamingResponse endpoint:
// emits one JSON line every 300ms, flushed immediately, chunked, uncompressed.
// ?pad=N appends N bytes of filler to each line (to cross gzip thresholds).
const http = require('http')
const { URL } = require('url')

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    const pad = Number(url.searchParams.get('pad') || 0)
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    let i = 0
    const t = setInterval(() => {
      if (i >= 10) {
        clearInterval(t)
        res.end()
        return
      }
      res.write(JSON.stringify({ number: i++, pad: 'x'.repeat(pad) }) + '\n')
    }, 300)
    req.on('close', () => clearInterval(t))
  })
  .listen(8000, '127.0.0.1', () => console.log('upstream on http://127.0.0.1:8000'))
