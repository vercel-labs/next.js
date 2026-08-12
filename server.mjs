// Serves a ~1.3MB JSON payload whose headers differ per response (age, date,
// server-timing), so concurrent cache writes for the same key differ in length.
import { createServer } from 'node:http'
const payload = JSON.stringify({
  result: Array.from({ length: 4000 }, (_, i) => ({ i, text: 'x'.repeat(300) })),
})
let n = 0
createServer((req, res) => {
  n++
  res.setHeader('content-type', 'application/json')
  res.setHeader('age', String(10 ** (n % 7)))
  res.setHeader('server-timing', `api;dur=${'9'.repeat((n % 9) + 1)}`)
  res.setHeader('x-trace', 'z'.repeat((n * 37) % 500))
  res.end(payload)
}).listen(4321, () => console.log('payload server on 4321'))
