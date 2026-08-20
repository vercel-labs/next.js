const next = require('next')
const express = require('express')

const app = next({ dev: false })
const handle = app.getRequestHandler()

async function start() {
  await app.prepare()
  const server = express()
  server.all('*', (req, res) => handle(req, res))
  server.listen(3001, () => console.log('custom server ready on 3001'))
}
start()
