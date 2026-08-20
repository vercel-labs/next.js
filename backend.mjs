// Minimal stand-in for the reporter's FastAPI thumbnail endpoint.
// It advertises a Content-Length larger than the body it actually writes,
// then ends the response (same failure mode as FastAPI's
// "RuntimeError: Response content shorter than Content-Length").
import http from 'node:http'

const BODY = Buffer.alloc(1024, 0x41)

http
  .createServer((req, res) => {
    if (req.url.startsWith('/thumbnail')) {
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(BODY.length * 64), // lies: 65536
      })
      res.write(BODY)
      res.end() // truncated body -> upstream stream ends early
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': '2' })
    res.end('ok')
  })
  .listen(4000, '127.0.0.1', () => console.log('backend on 4000'))
