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

  // Dynamic Pages API routes are matched against locale-prefixed request
  // pathnames when i18n is configured, so their generated matcher has to
  // accept that prefix or the request falls through to the 404 page.
  // https://github.com/vercel/next.js/issues/97230
  it('matches locale-prefixed request paths for dynamic Pages API routes', async () => {
    const { routing }: Parameters<NextAdapter['onBuildComplete']>[0] =
      await next.readJSON('build-complete.json')

    const apiRoute = routing.dynamicRoutes.find(
      (route) => route.source === '/api/proxy/[[...slug]]'
    )

    expect(apiRoute).toBeDefined()

    const apiRegex = new RegExp(apiRoute.sourceRegex)

    expect(apiRegex.test('/en/api/proxy/hello')).toBe(true)
    expect(apiRegex.test('/fr/api/proxy/hello')).toBe(true)
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
