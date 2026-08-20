const { createServer } = require('http')
const next = require('next')

const app = next({ dev: true, hostname: 'localhost', port: 3000 })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
