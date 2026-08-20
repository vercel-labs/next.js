const fs = require('node:fs');
const http = require('node:http');

http
  .createServer((req, res) => {
    const state = JSON.parse(fs.readFileSync('./state.json', 'utf8'));
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ id: req.url.split('/').pop(), ...state }));
  })
  .listen(3041, () => console.log('backend on http://localhost:3041'));
