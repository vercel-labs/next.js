// Sends a raw WebSocket upgrade request and reports the first bytes (or a timeout).
import net from 'node:net';

const target = process.argv[2] || 'http://127.0.0.1:3300/_next/webpack-hmr';
const u = new URL(target);
const timeoutMs = Number(process.env.TIMEOUT_MS || 8000);

const socket = net.connect(Number(u.port), u.hostname, () => {
  socket.write(
    `GET ${u.pathname}${u.search} HTTP/1.1\r\n` +
      `Host: ${u.host}\r\n` +
      'Connection: Upgrade\r\n' +
      'Upgrade: websocket\r\n' +
      'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n' +
      'Sec-WebSocket-Version: 13\r\n\r\n'
  );
});
let data = '';
socket.on('data', (c) => {
  data += c.toString('latin1');
  if (data.includes('\r\n\r\n')) {
    console.log(`${target}\n  -> ${data.split('\r\n')[0]}`);
    process.exit(0);
  }
});
socket.on('close', () => {
  if (!data) console.log(`${target}\n  -> connection closed with NO response`);
  process.exit(0);
});
setTimeout(() => {
  console.log(`${target}\n  -> STALLED: no response after ${timeoutMs}ms (bug)`);
  process.exit(1);
}, timeoutMs).unref?.();
