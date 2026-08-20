const http = require('http')
http.createServer(async (req, res) => {
  const r = await fetch('http://localhost:3000' + req.url)
  const body = await r.text()
  res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'text/html' })
  res.end(body)
}).listen(3001, () => console.log('proxy on 3001'))
