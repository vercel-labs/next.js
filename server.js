const http = require('http')
const next = require('next')

const port = Number(process.env.PORT || 3210)
const app = next({ dev: true, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  console.error('[CUSTOM] prepare resolved at', Date.now())
  http.createServer((req, res) => handle(req, res)).listen(port, () => {
    console.error('[CUSTOM] listening at', Date.now())
  })
})
