const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    if (pathname === '/a') {
      await app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      await app.render(req, res, '/b', query)
    } else {
      await handle(req, res, parsedUrl)
    }
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
