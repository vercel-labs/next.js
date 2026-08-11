// Streams a slow chunked POST body to the Next.js server, emulating an upload
// over a throttled connection. No browser / DevTools throttling needed.
import http from 'node:http'

const port = Number(process.env.PORT || 3000)
const totalSeconds = Number(process.env.SECONDS || 420) // keep uploading for 7 min
const t0 = Date.now()
const el = () => ((Date.now() - t0) / 1000).toFixed(1) + 's'

const req = http.request(
  { host: '127.0.0.1', port, path: '/api/upload', method: 'POST', headers: { 'content-type': 'application/octet-stream' } },
  (res) => {
    console.log(`[client] response ${res.statusCode} at ${el()}`)
    res.resume()
    res.on('end', () => console.log(`[client] response ended at ${el()}`))
  }
)

req.on('error', (err) => console.log(`[client] REQUEST ERROR at ${el()}: ${err.code || ''} ${err.message}`))
req.on('close', () => { console.log(`[client] socket closed at ${el()}`); process.exit(0) })

const chunk = Buffer.alloc(64 * 1024, 0x61) // 64 KB every second ~= 0.5 Mbps
let sent = 0
const timer = setInterval(() => {
  if ((Date.now() - t0) / 1000 >= totalSeconds) {
    clearInterval(timer)
    console.log(`[client] finishing body at ${el()} after ${sent} bytes`)
    req.end()
    return
  }
  req.write(chunk)
  sent += chunk.length
  if (sent % (64 * 1024 * 30) === 0) console.log(`[client] sent ${sent} bytes at ${el()}`)
}, 1000)
