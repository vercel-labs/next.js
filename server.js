// Minimal static host that mimics GitHub Pages / S3 semantics for `output: export`
// with a basePath: exact file match, then `<path>.html`, then 404.
const http = require('http');
const fs = require('fs');
const path = require('path');

const basePath = '/next-static-export-404-reproduce';
const outDir = path.join(__dirname, 'out');
const PORT = 3001;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/x-component; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (!pathname.startsWith(basePath)) {
      res.writeHead(404).end('404 outside basePath: ' + pathname);
      return;
    }
    let rel = pathname.slice(basePath.length) || '/';
    const candidates = rel.endsWith('/')
      ? [rel + 'index.html']
      : [rel, rel + '.html', rel + '/index.html'];

    for (const candidate of candidates) {
      const file = path.join(outDir, candidate);
      if (file.startsWith(outDir) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
        fs.createReadStream(file).pipe(res);
        console.log('200', req.url);
        return;
      }
    }
    console.log('404', req.url);
    res.writeHead(404, { 'content-type': 'text/html' }).end('404 ' + pathname);
  })
  .listen(PORT, () => console.log(`Server running at http://localhost:${PORT}${basePath}`));
