const http = require('http');
const port = Number(process.env.PROBE_PORT || 3999);
http.createServer((req, res) => {
  if (req.url === '/exit') { res.end('bye'); setTimeout(() => process.exit(0), 50); return; }
  global.gc(); global.gc();
  res.end(JSON.stringify({ heapUsed: process.memoryUsage().heapUsed, rss: process.memoryUsage().rss }));
}).listen(port, () => console.log('[probe] on ' + port));
