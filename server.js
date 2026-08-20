// Emulates Firebase Cloud Functions / express.json(): the request body stream is
// fully consumed and parsed BEFORE Next.js' request handler sees the request.
const express = require('express')
const next = require('next')
const { parse } = require('url')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, hostname: 'localhost', port: 3000 })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(express.json()) // <-- firebase-functions does the same thing
  server.all(/.*/, (req, res) => handle(req, res, parse(req.url, true)))
  server.listen(3000, () => console.log('> ready on http://localhost:3000'))
})
