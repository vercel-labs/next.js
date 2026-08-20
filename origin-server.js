// Standalone "other app" that the Next.js middleware proxies to.
const http = require('http')
http
  .createServer((req, res) => {
    res.writeHead(200, {
      'content-type': 'text/plain',
      'x-modify-me': 'original-value',
      'x-remove-me': 'should-be-removed',
      'cache-control': 'public, max-age=3600',
    })
    res.end('hello from origin app\n')
  })
  .listen(4000, () => console.log('origin app on http://localhost:4000'))
