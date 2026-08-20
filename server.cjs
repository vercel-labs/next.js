const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const port = Number(process.env.PORT || 3000)

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception log :', error)
})

const app = next({ dev, hostname: 'localhost', port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.all('*splat', (req, res) => handler(req, res))
  server.listen(port, () => console.log(`> Listening on http://localhost:${port}`))
})
