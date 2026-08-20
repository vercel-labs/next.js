// Minimal reverse proxy that mimics what nginx / Apache / Google App Engine do to
// percent-encoded request paths: they normalise the escape sequences (lower-casing
// the hex digits, or decoding "safe" characters such as "@").
import http from 'node:http'

const TARGET_PORT = process.env.TARGET_PORT || 3010
const PORT = process.env.PORT || 3011
const MODE = process.env.MODE || 'lowercase' // 'lowercase' | 'decode-at'

function normalize(url) {
  if (MODE === 'decode-at') return url.replaceAll('%40', '@')
  return url.replace(/%[0-9A-Fa-f]{2}/g, (m) => m.toLowerCase())
}

http
  .createServer((req, res) => {
    const url = normalize(req.url)
    const proxyReq = http.request(
      { host: '127.0.0.1', port: TARGET_PORT, method: req.method, path: url, headers: req.headers },
      (proxyRes) => {
        console.log(proxyRes.statusCode, url)
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res)
      }
    )
    req.pipe(proxyReq)
  })
  .listen(PORT, () => console.log(`proxy(${MODE}) :${PORT} -> :${TARGET_PORT}`))
