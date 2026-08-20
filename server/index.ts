import express, { Request, Response } from 'express'
import next from 'next'
// ESM-only package exposed through the "exports" field of its package.json
import lib from 'esm-only-lib'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = Number(process.env.PORT || 3000)
;(async () => {
  console.log('imported esm-only-lib =>', lib)
  await app.prepare()
  const server = express()
  server.all('*', (req: Request, res: Response) => handle(req, res))
  server.listen(port, () => console.log(`> Ready on http://localhost:${port}`))
})()
