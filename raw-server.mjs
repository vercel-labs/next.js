import http from 'http'
http.createServer((req, res) => {
  const size = Number(new URL(req.url, 'http://x').searchParams.get('size') || 300)
  res.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' })
  let head = `<!DOCTYPE html><html><body><h1 id="shell">Shell rendered</h1><p id="fallback">Loading car...</p>`
  const pad = `<!--${'x'.repeat(Math.max(0, size - head.length - 7))}-->`
  res.write(head + pad)
  setTimeout(() => { res.end(`<p id="car">Car loaded</p></body></html>`) }, 5000)
}).listen(4000, () => console.log('raw on 4000'))
