// WORKAROUND (uncomment these 4 lines and the crash goes away):
// const { AsyncLocalStorage } = require("node:async_hooks");
// if (typeof globalThis.AsyncLocalStorage !== "function") {
//   globalThis.AsyncLocalStorage = AsyncLocalStorage;
// }

const express = require('express')
const next = require('next')
// This helper requires a Next.js module (next/headers) at module scope, before
// Next's own `node-environment` baseline has polyfilled globalThis.AsyncLocalStorage.
const handleRedirects = require('./utils/handleRedirects')

const port = Number.parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, port })
const defaultHandler = nextApp.getRequestHandler()

const init = async () => {
  await nextApp.prepare()
  const app = express()
  app.use(handleRedirects)
  app.all(/.*/, (req, res) => defaultHandler(req, res))
  app.listen(port, () => console.log(`ready on http://localhost:${port}`))
}

init().catch((e) => {
  console.error(e)
  process.exit(-1)
})
