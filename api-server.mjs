import https from 'node:https'
import fs from 'node:fs'

const server = https.createServer(
  { key: fs.readFileSync('certs/key.pem'), cert: fs.readFileSync('certs/cert.pem') },
  (req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify([{ date: '2025-01-01', temperatureC: 20, summary: 'Mild' }]))
  }
)
server.listen(7248, 'localhost', () => console.log('self-signed https api on https://localhost:7248'))
