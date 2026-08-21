import http from 'node:http'

const port = Number(process.env.PORT || 3000)
const sizes = [1_000, 10_000, 60_000, 200_000]

for (const n of sizes) {
  const body = JSON.stringify({ data: 'x'.repeat(n) })
  const out = await new Promise((resolve) => {
    const req = http.request(
      {
        port,
        path: '/api/echo',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let b = ''
        res.on('data', (d) => (b += d))
        res.on('end', () => resolve(`status=${res.statusCode} ${b.slice(0, 160)}`))
      }
    )
    req.on('error', (e) => resolve('ERR ' + e.message))
    req.end(body)
  })
  console.log(`POST /api/echo sent=${Buffer.byteLength(body)} -> ${out}`)
}
