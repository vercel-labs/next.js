// Minimal HTTP CONNECT proxy with a global (aggregate) download bandwidth limit.
// Simulates a slow/shared network so that Turbopack's per-request font fetch
// timeout (5s connect / 10s total in dev since Next 16.3.0) can be exceeded.
const net = require('net')
const http = require('http')

const PORT = Number(process.env.PROXY_PORT || 8899)
// bytes per second, aggregate across all tunnels
const RATE = Number(process.env.PROXY_RATE || 700 * 1024)

let tokens = RATE
setInterval(() => {
  tokens = RATE
}, 1000).unref()

let connects = 0
const server = http.createServer((req, res) => {
  res.writeHead(405).end()
})

server.on('connect', (req, clientSocket, head) => {
  const [host, port = '443'] = req.url.split(':')
  connects++
  const upstream = net.connect(Number(port), host, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
    if (head && head.length) upstream.write(head)
    clientSocket.pipe(upstream)
  })
  // throttle upstream -> client (download direction), aggregate token bucket
  upstream.on('data', (chunk) => {
    tokens -= chunk.length
    clientSocket.write(chunk)
    if (tokens <= 0) {
      upstream.pause()
      setTimeout(() => upstream.resume(), Math.max(50, (-tokens / RATE) * 1000 + 50))
    }
  })
  upstream.on('end', () => clientSocket.end())
  upstream.on('error', () => clientSocket.destroy())
  clientSocket.on('error', () => upstream.destroy())
})

server.listen(PORT, () => {
  console.log(`throttling CONNECT proxy on ${PORT}, ${RATE} B/s aggregate`)
})
setInterval(() => console.log(`tunnels: ${connects}`), 5000).unref()
