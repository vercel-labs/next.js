const express = require('express')
const next = require('next')
const port = 3002
const assetPrefix = '/prefix-a'
const app = next({ dev: false, customServer: true })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  app.setAssetPrefix(assetPrefix)
  const server = express()
  server.use((req, res, nxt) => {
    if (req.url.includes('_next/static') && !req.url.startsWith(assetPrefix)) {
      console.log('404 (missing assetPrefix):', req.url)
      res.status(404).send()
      return
    }
    req.url = req.url.replace(assetPrefix, '')
    nxt()
  })
  server.all('*', (req, res) => handle(req, res))
  server.listen(port, () => console.log('> Ready on http://localhost:' + port))
})
