// Tiny upstream API. GET /products/:id -> 200 while the product exists.
// POST /admin/delete/:id "deletes" it so subsequent GETs answer 404.
import { createServer } from 'node:http'

const deleted = new Set()
let requests = 0

createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const del = url.pathname.match(/^\/admin\/delete\/(.+)$/)
  if (del) {
    deleted.add(del[1])
    res.writeHead(200).end('deleted\n')
    return
  }
  const m = url.pathname.match(/^\/products\/(.+)$/)
  if (m) {
    requests++
    const id = m[1]
    console.log(`[upstream] #${requests} GET /products/${id} -> ${deleted.has(id) ? 404 : 200}`)
    if (deleted.has(id)) {
      res.writeHead(404, { 'content-type': 'application/json' }).end(
        JSON.stringify({ error: 'not found' })
      )
      return
    }
    res
      .writeHead(200, { 'content-type': 'application/json' })
      .end(JSON.stringify({ id, name: `Product ${id}`, servedAt: new Date().toISOString() }))
    return
  }
  res.writeHead(404).end()
}).listen(9099, () => console.log('[upstream] listening on http://127.0.0.1:9099'))
