// Fake upstream API: returns a fresh random value on every request.
const http = require('http');
http
  .createServer((req, res) => {
    const body = JSON.stringify({ value: Math.random().toString(36).slice(2, 10), at: new Date().toISOString() });
    console.log('[upstream] hit', req.url, body);
    res.setHeader('content-type', 'application/json');
    res.end(body);
  })
  .listen(3999, () => console.log('upstream on http://localhost:3999'));
