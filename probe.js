import { createServer } from 'http'
import next from 'next'
const app = next({ dev: false })
const handle = app.getRequestHandler()
await app.prepare()
const server = createServer((req, res) => {
  const p = handle(req, res, { pathname: null, query: '%' , href: '%'})
  console.log('handle returned:', p && typeof p.then === 'function' ? 'Promise' : typeof p)
  if (p && p.catch) p.then(() => console.log('resolved')).catch(e => console.log('REJECTED:', e && e.message))
})
server.listen(3101, () => console.log('probe listening 3101'))
