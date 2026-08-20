// Simple upstream data server so cached fetches hit an external origin.
const http = require('http')
http
  .createServer((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ url: req.url, now: Date.now() }))
  })
  .listen(3001, () => console.log('data server on http://localhost:3001'))
