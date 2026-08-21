const net = require('net');
const path = process.argv[2];
const port = 3400;
const s = net.connect(port, '127.0.0.1', () => {
  s.write(`GET ${path} HTTP/1.1\r\nHost: localhost:${port}\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n`);
});
let out = '';
const t = setTimeout(() => { console.log(`${path} => STALLED (no response in 8s)`); s.destroy(); process.exit(0); }, 8000);
s.on('data', d => { out += d.toString(); if (out.includes('\r\n')) { clearTimeout(t); console.log(`${path} => ${out.split('\r\n')[0]}`); s.destroy(); process.exit(0); } });
s.on('error', e => { clearTimeout(t); console.log(`${path} => ERROR ${e.message}`); process.exit(0); });
