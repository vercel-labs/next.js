import http from 'node:http'

export const dynamic = 'force-dynamic'

// Mimics what the AWS S3 SDK does for some PUT operations: it uses the Node
// http handler with an `expect: 100-continue` header. This works normally, but
// when experimental.testProxy is enabled Next intercepts http.request and
// re-issues it through undici fetch, which rejects the `expect` header.
function put() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port: Number(process.env.ECHO_PORT || 4001),
        path: '/',
        method: 'PUT',
        headers: { expect: '100-continue', 'content-length': 5 },
      },
      (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ status: res.statusCode, body }))
      }
    )
    let sent = false
    const send = () => {
      if (!sent) {
        sent = true
        req.end('hello')
      }
    }
    req.on('error', reject)
    req.on('continue', send)
    setTimeout(send, 500)
  })
}

export async function GET() {
  try {
    const r = await put()
    return Response.json({ ok: true, ...r })
  } catch (err) {
    return Response.json(
      {
        ok: false,
        name: err?.name,
        message: err?.message,
        cause: err?.cause
          ? { name: err.cause.name, message: err.cause.message }
          : null,
        stack: err?.stack,
      },
      { status: 500 }
    )
  }
}
