const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
  const v = fs.existsSync('/tmp/value.txt') ? fs.readFileSync('/tmp/value.txt','utf8').trim() : 'unset';
  console.log(new Date().toISOString(), 'BACKEND HIT', req.method, req.url, '->', v);
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ value: v, servedAt: new Date().toISOString() }));
}).listen(3001, () => console.log('backend on 3001'));
