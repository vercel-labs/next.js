// Minimal stand-in for a Django REST backend with APPEND_SLASH=True (the default).
// Django responds to /api/groups (no trailing slash) with a 301 to /api/groups/.
const http = require('http');
http
  .createServer((req, res) => {
    const [path, query] = req.url.split('?');
    if (!path.endsWith('/')) {
      const location = path + '/' + (query ? '?' + query : '');
      console.log(`[backend] ${req.method} ${req.url} -> 301 ${location}`);
      res.writeHead(301, { Location: location });
      return res.end();
    }
    console.log(`[backend] ${req.method} ${req.url} -> 200`);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, path }));
  })
  .listen(8000, () => console.log('django-like backend on :8000'));
