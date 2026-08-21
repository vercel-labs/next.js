// Minimal stand-in for the reporter's nginx: an upgrade-aware reverse proxy
// in front of `next dev`. PROXY_MODE=strip removes the assetPrefix path
// segment before forwarding (what the reporter's nginx config does);
// PROXY_MODE=passthrough forwards the URL unchanged.
import http from 'node:http';
import net from 'node:net';

const MODE = process.env.PROXY_MODE || 'strip';
const PREFIX = /^\/app1\/[0-9.]+/;
const UPSTREAM = { host: '127.0.0.1', port: 3300 };

const rewrite = (url) => (MODE === 'strip' ? url.replace(PREFIX, '') || '/' : url);

const server = http.createServer((req, res) => {
  const path = rewrite(req.url);
  const up = http.request(
    { ...UPSTREAM, method: req.method, path, headers: { ...req.headers, host: `127.0.0.1:3300` } },
    (upRes) => {
      res.writeHead(upRes.statusCode, upRes.headers);
      upRes.pipe(res);
    }
  );
  up.on('error', () => res.destroy());
  req.pipe(up);
});

server.on('upgrade', (req, socket, head) => {
  const path = rewrite(req.url);
  console.log(`[proxy] upgrade ${req.url} -> ${path}`);
  const up = http.request({
    ...UPSTREAM,
    method: req.method,
    path,
    headers: { ...req.headers, host: `127.0.0.1:3300` },
  });
  up.on('upgrade', (upRes, upSocket, upHead) => {
    console.log(`[proxy] upstream responded ${upRes.statusCode} for ${path}`);
    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\n` +
        Object.entries(upRes.headers)
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join('') +
        '\r\n'
    );
    if (upHead?.length) socket.write(upHead);
    upSocket.on('error', () => {});
    upSocket.pipe(socket).pipe(upSocket);
  });
  up.on('response', (upRes) => {
    console.log(`[proxy] upstream refused upgrade with ${upRes.statusCode} for ${path}`);
    socket.end(`HTTP/1.1 ${upRes.statusCode} ${upRes.statusMessage}\r\n\r\n`);
  });
  up.on('error', () => socket.destroy());
  socket.on('error', () => {});
  if (head?.length) up.write(head);
  up.end();
});

server.listen(8888, () => console.log(`[proxy] mode=${MODE} listening on http://localhost:8888 -> :3300`));
