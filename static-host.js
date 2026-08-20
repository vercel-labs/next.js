// Simulates a CDN/browser cache that cached deploy A's prefetch .txt payloads
// (URLs are identical across deploys) while serving deploy B's HTML/JS.
const http = require('http'), fs = require('fs'), path = require('path');
const types = {'.html':'text/html','.js':'application/javascript','.txt':'text/plain','.json':'application/json','.ico':'image/x-icon'};
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  const stale = process.env.STALE !== '0' && p.endsWith('.txt');
  const root = stale ? 'outA' : 'outB';
  let f = path.join(__dirname, root, p);
  if (p.endsWith('/')) f = path.join(f, 'index.html');
  if ((!fs.existsSync(f) || fs.statSync(f).isDirectory()) && fs.existsSync(f + '.html')) f += '.html';
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    console.log('404', p); res.writeHead(404); return res.end('not found');
  }
  console.log(res.statusCode = 200, p, stale ? '(served STALE deploy A copy)' : '');
  res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
}).listen(3002, () => console.log('http://localhost:3002'));
