// Reads /api/basicStream through the Next server and prints arrival time of each
// wire chunk and each decoded chunk.
//   node scripts/probe.js <port> <accept-encoding> <pad-bytes>
const http = require('http')
const zlib = require('zlib')

const port = process.argv[2] || '3000'
const enc = process.argv[3] || 'identity'
const pad = process.argv[4] || '0'
const start = Date.now()

http
  .request(
    {
      host: '127.0.0.1',
      port,
      path: `/api/basicStream?pad=${pad}`,
      method: 'GET',
      headers: { 'Accept-Encoding': enc },
    },
    (res) => {
      console.log(
        `status=${res.statusCode} content-encoding=${res.headers['content-encoding'] || 'none'} transfer-encoding=${res.headers['transfer-encoding'] || 'none'}`
      )
      let raw = 0
      let n = 0
      res.on('data', (b) => console.log(`  wire ${++raw} @ ${Date.now() - start}ms (${b.length}B)`))
      const stream = res.headers['content-encoding'] === 'gzip' ? res.pipe(zlib.createGunzip()) : res
      stream.on('data', () => n++)
      stream.on('end', () => console.log(`done @ ${Date.now() - start}ms wire_chunks=${raw} decoded_chunks=${n}`))
    }
  )
  .end()
