// Minimal stand-in for nginx-proxy default config:
// sets X-Forwarded-Host without the port, plus X-Forwarded-Port / X-Forwarded-Proto.
const http = require('http');
const PORT = Number(process.env.PORT || 3333);
const TARGET_PORT = Number(process.env.TARGET_PORT || 3000);
http.createServer((req, res) => {
  const host = (req.headers.host || '').split(':')[0];
  const headers = { ...req.headers };
  headers['x-forwarded-host'] = host; // no port, like nginx-proxy default
  headers['x-forwarded-port'] = String(PORT);
  headers['x-forwarded-proto'] = 'http';
  headers['x-forwarded-for'] = req.socket.remoteAddress;
  const p = http.request({ host: '127.0.0.1', port: TARGET_PORT, method: req.method, path: req.url, headers }, (pr) => {
    res.writeHead(pr.statusCode, pr.headers);
    pr.pipe(res);
  });
  p.on('error', (e) => { res.writeHead(502); res.end(String(e)); });
  req.pipe(p);
}).on('upgrade', (req, socket, head) => {
  const net = require('net');
  const up = net.connect(TARGET_PORT, '127.0.0.1', () => {
    up.write(`${req.method} ${req.url} HTTP/1.1\r\n` + Object.entries(req.headers).map(([k,v])=>`${k}: ${v}`).join('\r\n') + '\r\n\r\n');
    up.write(head);
    up.pipe(socket).pipe(up);
  });
  up.on('error', () => socket.destroy());
}).listen(PORT, () => console.log('proxy on ' + PORT + ' -> ' + TARGET_PORT));
