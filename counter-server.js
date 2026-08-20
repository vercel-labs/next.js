const http = require('http');
let count = 0;
http
  .createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    if (req.url === '/__count') {
      res.end(JSON.stringify({ count }));
      return;
    }
    count++;
    console.log('[counter] HIT #' + count + ' ' + req.url);
    res.end(JSON.stringify({ count }));
  })
  .listen(8088, () => console.log('counter server on http://localhost:8088'));
