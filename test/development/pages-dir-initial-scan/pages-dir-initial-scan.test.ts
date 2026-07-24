import { nextTestSetup } from 'e2e-utils'

describe('pages directory initial scan', () => {
  const { next } = nextTestSetup({
    files: {
      'pages/index.js': `export default function Page() { return null }`,
      'pages/api/[id].js': `
        export default function handler(req, res) {
          res.status(200).json({ id: req.query.id })
        }
      `,
      'server.js': `
        const { createServer } = require('http')
        const next = require('next')

        const port = Number(process.env.PORT)
        const app = next({ dev: true, dir: __dirname })
        const handle = app.getRequestHandler()

        app.prepare().then(() => {
          createServer((req, res) => handle(req, res)).listen(port, () => {
            console.log('- Local: http://localhost:' + port)
          })
        })
      `,
      'slow-initial-scan.js': `
        const fs = require('fs')
        const readdir = fs.readdir
        let delayed = false

        fs.readdir = function (directory, ...args) {
          const callback =
            typeof args.at(-1) === 'function' ? args.at(-1) : null
          if (
            delayed ||
            !callback ||
            !/\\/pages\\/api$/.test(String(directory))
          ) {
            return readdir.call(this, directory, ...args)
          }

          delayed = true
          args[args.length - 1] = (...result) => {
            setTimeout(() => callback(...result), 5000)
          }
          return readdir.call(this, directory, ...args)
        }
      `,
    },
    startCommand: 'node server.js',
    serverReadyPattern: /- Local:/,
    forcedPort: 'random',
    env: {
      NODE_OPTIONS: '--require ./slow-initial-scan.js',
    },
  })

  it('waits for dynamic routes before resolving prepare', async () => {
    const response = await next.fetch('/api/123')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ id: '123' })
  })
})
