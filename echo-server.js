const http = require('http')
http
  .createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'text/plain' })
      res.end('echo:' + body)
    })
  })
  .listen(4001, '127.0.0.1', () => console.log('echo server on 4001'))
