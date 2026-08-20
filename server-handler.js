const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    if (parsedUrl.pathname === '/a') {
      await handle(req, res, { ...parsedUrl, pathname: '/a' })
    } else {
      await handle(req, res, parsedUrl)
    }
  }).listen(3001, () => console.log('> handler server on 3001'))
})
