// Upstream origin: counts every request that actually hits it.
const http = require('http');
let hits = 0;
http
  .createServer((req, res) => {
    hits++;
    res.setHeader('content-type', 'application/json');
    res.setHeader('cache-control', 'no-store');
    res.end(JSON.stringify({ url: req.url, hits, time: new Date().toISOString() }));
  })
  .listen(3999, () => console.log('origin listening on 3999'));
