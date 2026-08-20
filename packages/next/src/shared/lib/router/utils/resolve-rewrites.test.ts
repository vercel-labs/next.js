import resolveRewrites from './resolve-rewrites'
import { isDynamicRoute } from './is-dynamic'
import { getRouteRegex } from './route-regex'
import { removeTrailingSlash } from './remove-trailing-slash'

// mirrors `resolveDynamicRoute` from shared/lib/router/router.ts
function resolveDynamicRoute(pathname: string, pages: string[]) {
  const cleanPathname = removeTrailingSlash(pathname)

  if (!pages.includes(cleanPathname)) {
    // eslint-disable-next-line array-callback-return
    pages.some((page) => {
      if (isDynamicRoute(page) && getRouteRegex(page).re.test(cleanPathname)) {
        pathname = page
        return true
      }
    })
  }
  return removeTrailingSlash(pathname)
}

const pages = ['/', '/home', '/test/[slug]']

function resolve(asPath: string, rewrites: any[]) {
  return resolveRewrites(
    asPath,
    pages,
    { beforeFiles: [], afterFiles: rewrites, fallback: [] },
    {},
    (path: string) => resolveDynamicRoute(path, pages)
  )
}

describe('resolveRewrites with trailingSlash', () => {
  beforeEach(() => {
    process.env.__NEXT_TRAILING_SLASH = 'true'
  })
  afterEach(() => {
    delete process.env.__NEXT_TRAILING_SLASH
  })

  // https://github.com/vercel/next.js/issues/39638
  it('should match a rewrite source that has a trailing slash', () => {
    const result = resolve('/test/', [
      { source: '/test/', destination: '/test/1/' },
    ])

    expect(result.matchedPage).toBe(true)
    expect(result.resolvedHref).toBe('/test/[slug]')
    expect(result.parsedAs.pathname).toBe('/test/1/')
  })

  it('should match a rewrite source without a trailing slash', () => {
    const result = resolve('/no-slash', [
      { source: '/no-slash', destination: '/test/2/' },
    ])

    expect(result.matchedPage).toBe(true)
    expect(result.resolvedHref).toBe('/test/[slug]')
    expect(result.parsedAs.pathname).toBe('/test/2/')
  })
})
