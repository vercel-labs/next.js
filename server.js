// Instrumented custom server: observes findPageComponents calls made by
// BaseServer.renderErrorToResponseImpl() for the static /500 status page.
const http = require('http')
const next = require('next')

const NextNodeServer = require('next/dist/server/next-server').default

const original = NextNodeServer.prototype.findPageComponents
const calls = []

// FIX_APP_LOOKUP=1 emulates the missing getOriginalAppPaths('/500') mapping,
// so the App Router lookup returns a real non-null result for app/500/page.tsx.
const FIX = process.env.FIX_APP_LOOKUP === '1'

NextNodeServer.prototype.findPageComponents = async function (params) {
  let effective = params
  if (FIX && params.page === '/500' && params.isAppPath) {
    const appPaths = this.getOriginalAppPaths
      ? this.getOriginalAppPaths('/500')
      : ['/500/page']
    effective = {
      ...params,
      page: appPaths ? appPaths[appPaths.length - 1] : '/500/page',
      appPaths: appPaths || ['/500/page'],
    }
  }
  const result = await original.call(this, effective)
  if (params.page === '/500' || params.page === '/_error') {
    const entry = {
      requestedPage: params.page,
      lookedUpPage: effective.page,
      isAppPath: params.isAppPath,
      result: result ? result.components.page || '(non-null)' : null,
    }
    calls.push(entry)
    console.log('[findPageComponents]', JSON.stringify(entry))
  }
  return result
}

const app = next({ dev: false, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      if (req.url === '/__calls') {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(calls, null, 2))
        return
      }
      handle(req, res)
    })
    .listen(3101, () => console.log('instrumented server on 3101, FIX=' + FIX))
})
