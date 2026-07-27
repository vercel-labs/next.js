import http from 'node:http'
import { Readable } from 'node:stream'

const server = http.createServer(async (incoming, outgoing) => {
  try {
    const request = new Request('http://localhost/', {
      method: 'POST',
      headers: incoming.headers,
      body: Readable.toWeb(incoming),
      duplex: 'half',
    })
    const formData = await request.formData()
    const file = formData.get('file')
    outgoing.writeHead(200, { 'content-type': 'application/json' })
    outgoing.end(JSON.stringify({ ok: true, size: file?.size ?? null }))
  } catch (error) {
    console.error('DIRECT_UNDICI_ERROR', error)
    outgoing.writeHead(500, { 'content-type': 'application/json' })
    outgoing.end(JSON.stringify({ ok: false, message: error?.message, cause: error?.cause?.message ?? null }))
  } finally {
    server.close()
  }
})
server.listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () => {
  console.log(`Direct Node/Undici server on port ${server.address().port}; run npm run upload -- <bytes>`)
})
