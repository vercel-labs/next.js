import { nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/96521.
//
// `@mswjs/interceptors` intercepts outgoing requests at the socket level, so
// the `originalFetch(request)` passthrough for non-test requests in
// `experimental/testmode/fetch.ts` is intercepted again by the
// `ClientRequestInterceptor` installed in `experimental/testmode/httpget.ts`.
// Without a guard, the request recurses through the passthrough branch until
// the server runs out of memory and never reaches the upstream server.
//
// This lives in its own file because the recursion only happens when the
// passthrough is the first outgoing request of the server process, so it can't
// be observed after another test already triggered one.
describe('testmode - passthrough', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
    dependencies: require('./package.json').dependencies,
  })

  if (skipped) {
    return
  }

  it('should perform a real http.get when Next-Test-* headers are not present', async () => {
    const json = await (await next.fetch('/api/httpget')).json()
    expect(json.text).toContain('Example Domain')
  })
})
