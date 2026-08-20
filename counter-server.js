// Standalone endpoint that counts how many times the server component fetched it.
const http = require('http');
let count = 0;
http
  .createServer((req, res) => {
    if (req.url.startsWith('/reset')) {
      count = 0;
      res.end('reset');
      return;
    }
    if (req.url.startsWith('/count')) {
      res.end(String(count));
      return;
    }
    count++;
    console.log(`[counter] hit #${count} ${req.url} at ${new Date().toISOString()}`);
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ hit: count, url: req.url }));
  })
  .listen(4000, () => console.log('counter on 4000'));
