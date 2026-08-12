import { nextTestSetup } from 'e2e-utils'
import type { NextAdapter } from 'next'

describe('adapter config with i18n routes', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('does not localize dynamic Pages API routes', async () => {
    const { outputs, routing }: Parameters<NextAdapter['onBuildComplete']>[0] =
      await next.readJSON('build-complete.json')

    const apiOutput = outputs.pagesApi.find(
      (output) => output.pathname === '/api/proxy/[[...slug]]'
    )
    const apiRoute = routing.dynamicRoutes.find(
      (route) => route.source === '/api/proxy/[[...slug]]'
    )
    const pageRoute = routing.dynamicRoutes.find(
      (route) => route.source === '/blog/[slug]'
    )

    expect(apiOutput).toBeDefined()
    expect(apiRoute).toBeDefined()
    expect(apiRoute?.sourceRegex).not.toContain('nextLocale')
    expect(apiRoute?.destination).toBe(
      '/api/proxy/[[...slug]]?nxtPslug=$nxtPslug'
    )

    expect(pageRoute).toBeDefined()
    expect(pageRoute?.sourceRegex).toContain('nextLocale')
    expect(pageRoute?.destination).toBe(
      '/$nextLocale/blog/[slug]?nxtPslug=$nxtPslug'
    )
  })

  // Regression test for https://github.com/vercel/next.js/issues/96931:
  // hosting providers resolve Pages Router requests through a locale before
  // dynamic route matching, so the emitted matchers must still route a
  // locale-prefixed request to the dynamic Pages API route instead of the
  // localized 404.
  it('matches locale-prefixed request paths against dynamic Pages API routes', async () => {
    const { routing }: Parameters<NextAdapter['onBuildComplete']>[0] =
      await next.readJSON('build-complete.json')

    const matchDestination = (pathname: string) =>
      routing.dynamicRoutes.find((route) =>
        new RegExp(route.sourceRegex).test(pathname)
      )?.destination

    for (const locale of ['en', 'fr']) {
      expect(matchDestination(`/${locale}/api/proxy/hello`)).toContain(
        '/api/proxy/[[...slug]]'
      )
    }
  })

  it('does not emit outputs multiple times for a given pathname', async () => {
    const { outputs }: Parameters<NextAdapter['onBuildComplete']>[0] =
      await next.readJSON('build-complete.json')

    const pathnameSet = (f) => new Set(f.map((o) => o.pathname))

    expect(pathnameSet(outputs.pages).size).toBe(outputs.pages.length)
    expect(pathnameSet(outputs.appPages).size).toBe(outputs.appPages.length)
    expect(pathnameSet(outputs.pagesApi).size).toBe(outputs.pagesApi.length)
    expect(pathnameSet(outputs.appRoutes).size).toBe(outputs.appRoutes.length)
    expect(pathnameSet(outputs.prerenders).size).toBe(outputs.prerenders.length)
    expect(pathnameSet(outputs.staticFiles).size).toBe(
      outputs.staticFiles.length
    )
  })
})
