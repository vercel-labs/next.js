const http = require('http')
const next = require('next')

const app = next({ dev: true, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = http.createServer(handle)
  server.listen(0, () => {
    const { port } = server.address()
    console.log(`- Local: http://localhost:${port}`)
  })
})
