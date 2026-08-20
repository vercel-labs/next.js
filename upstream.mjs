// Minimal stand-in for a real remote image host (imagekit.io in the original report).
//
//   GET /slow.jpg?delay=8000 -> valid JPEG, but only after 8s
//                               (above the hard-coded 7s timeout inside
//                                next/dist/server/image-optimizer.js)
//   GET /flaky.jpg           -> destroys the socket (transient upstream failure)
//   GET /fast.jpg            -> valid JPEG immediately
import { createServer } from 'node:http'

const JPEG = Buffer.from(
  '/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABAAEADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAUH/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AnAERqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9k=',
  'base64'
)

const port = Number(process.env.UPSTREAM_PORT || 4001)

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  console.log('upstream <-', req.url)

  if (url.pathname === '/flaky.jpg') {
    res.socket.destroy()
    return
  }

  const delay = Number(url.searchParams.get('delay') || 0)
  setTimeout(() => {
    res.writeHead(200, {
      'content-type': 'image/jpeg',
      'content-length': String(JPEG.byteLength),
      'cache-control': 'public, max-age=3600',
    })
    res.end(JPEG)
  }, delay)
}).listen(port, '127.0.0.1', () => {
  console.log(`upstream image host on http://127.0.0.1:${port}`)
})
