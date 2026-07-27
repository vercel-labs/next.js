import http from 'node:http'

const fileBytes = Number(process.argv[2] ?? 1024)
const port = Number(process.env.PORT ?? 3000)
if (!Number.isSafeInteger(fileBytes) || fileBytes < 0) throw new Error('size must be a non-negative safe integer')

const boundary = '--------------------------nextjs73220'
const prefix = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="zeros.bin"\r\nContent-Type: application/octet-stream\r\n\r\n`)
const suffix = Buffer.from(`\r\n--${boundary}--\r\n`)
const contentLength = prefix.length + fileBytes + suffix.length
const zeroChunk = Buffer.alloc(1024 * 1024)

console.log(JSON.stringify({ fileBytes, contentLength, closingBoundaryOffset: prefix.length + fileBytes + 4 }))
const request = http.request({
  host: '127.0.0.1',
  port,
  path: '/api/upload',
  method: 'POST',
  headers: {
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(contentLength),
  },
}, response => {
  const chunks = []
  response.on('data', chunk => chunks.push(chunk))
  response.on('end', () => {
    console.log(`HTTP ${response.statusCode}`)
    console.log(Buffer.concat(chunks).toString())
    process.exitCode = response.statusCode === 200 ? 0 : 1
  })
})
request.on('error', error => { console.error(error); process.exitCode = 1 })
request.write(prefix)
let remaining = fileBytes
function write() {
  while (remaining > 0) {
    const chunk = remaining >= zeroChunk.length ? zeroChunk : zeroChunk.subarray(0, remaining)
    remaining -= chunk.length
    if (!request.write(chunk)) return request.once('drain', write)
  }
  request.end(suffix)
}
write()
