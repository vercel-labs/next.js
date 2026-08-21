import http from 'node:http'
import fs from 'node:fs'

const port = Number(process.env.PORT || 3000)
const manifest = JSON.parse(
  fs.readFileSync('.next/server/server-reference-manifest.json', 'utf8')
)
const actionId = Object.keys(manifest.node)[0]
const kb = Number(process.env.KB || 256)
const body = Buffer.from(JSON.stringify(['y'.repeat(kb * 1024)]))

for (let i = 0; i < 3; i++) {
  const out = await new Promise((resolve) => {
    const req = http.request(
      {
        port,
        path: '/action',
        method: 'POST',
        headers: {
          'next-action': actionId,
          'content-type': 'text/plain;charset=UTF-8',
          accept: 'text/x-component',
          'content-length': body.length,
        },
      },
      (res) => {
        let b = ''
        res.on('data', (d) => (b += d))
        res.on('end', () =>
          resolve(`status=${res.statusCode} ${b.replace(/\n/g, ' ').slice(0, 200)}`)
        )
      }
    )
    req.on('error', (e) => resolve('ERR ' + e.message))
    req.end(body)
  })
  console.log(
    `server action sent=${kb * 1024} chars (expect receivedLength=${kb * 1024}) -> ${out}`
  )
}
