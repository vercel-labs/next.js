const next = require('next')
const http = require('http')
const app = next({ dev: false, dir: process.env.NEXT_DIR || __dirname })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(3002, () => console.log('custom server on 3002'))
})
