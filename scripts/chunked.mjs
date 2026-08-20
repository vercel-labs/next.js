// Sends multipart/form-data with chunked transfer-encoding and slow trickle
import https from 'node:https';
import http from 'node:http';
const url = new URL(process.argv[2]);
const path = process.argv[3] || '/api/upload';
const delayMs = Number(process.argv[4] || 500);
const mod = url.protocol === 'https:' ? https : http;
const boundary = '----XBOUND';
const parts = [
  `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`,
  'aaaaaaaaaaaaaaaa',
  `\r\n--${boundary}--\r\n`,
];
const t0 = Date.now();
let timer;
const req = mod.request({ hostname: url.hostname, port: url.port, path, method: 'POST', protocol: url.protocol,
  headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'transfer-encoding': 'chunked' } }, (res) => {
  let b = '';
  res.on('data', (d) => (b += d));
  res.on('end', () => { clearTimeout(timer); console.log(`chunked ${path} -> ${res.statusCode} in ${Date.now() - t0}ms :: ${b.slice(0,200)}`); });
});
req.on('error', (e) => console.log('chunked ERROR', Date.now()-t0, e.message));
timer = setTimeout(() => { console.log(`chunked -> HUNG after ${Date.now()-t0}ms`); req.destroy(); process.exit(0); }, 30000);
(async () => {
  for (const p of parts) { req.write(p); await new Promise((r) => setTimeout(r, delayMs)); }
  req.end();
})();
