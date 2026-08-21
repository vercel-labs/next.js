// Serves stale HTML (build v1) together with fresh assets (build v2),
// i.e. exactly what a CDN/browser cache does across two static-export deploys.
const http = require('http'), fs = require('fs'), p = require('path');
const V1 = p.join(__dirname, 'out-v1');
const V2 = p.join(__dirname, 'out-v2');
http.createServer((req, res) => {
  const u = req.url.split('?')[0];
  let f = p.join(u.startsWith('/_next/') ? V2 : V1, u);
  try { if (fs.statSync(f).isDirectory()) f = p.join(f, 'index.html'); } catch {}
  fs.readFile(f, (e, d) => {
    if (e) { console.log('404', u); res.writeHead(404); return res.end('404'); }
    console.log('200', u);
    const ext = p.extname(f);
    res.writeHead(200, { 'Content-Type': ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : 'text/plain' });
    res.end(d);
  });
}).listen(3123, () => console.log('serving http://localhost:3123'));
