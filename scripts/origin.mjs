// Stands in for a remote image host, so the repro can show that external
// images go through a different code path and are NOT affected.
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'

const FILE = 'public/big.jpg'
createServer((_req, res) => {
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': statSync(FILE).size,
    'Cache-Control': 'public, max-age=3600',
  })
  createReadStream(FILE).pipe(res)
}).listen(9999, '127.0.0.1', () => console.log('origin listening on 127.0.0.1:9999'))
