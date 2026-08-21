import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'

// Config passed via `conf` (documented at
// https://nextjs.org/docs/pages/guides/custom-server#options).
// With no next.config.* file present, basePath is ignored.
const app = next({ dev, conf: { devIndicators: false, basePath: '/config-test' } })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res, parse(req.url, true))).listen(port)
  console.log(`> Server listening at http://localhost:${port} (dev=${dev})`)
})
