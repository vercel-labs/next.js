import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import type { Page, Request } from 'playwright'

// Regression test for https://github.com/vercel/next.js/issues/97329
//
// Route shape:
//   app/categories/[[...slug]]/page  <- current page, links to products
//   app/products/[...slug]/page      <- product route
//   next.config.js `redirects()`     <- /products/retired-N => /categories/wine/*
//
// Prefetching the *live* product links first teaches the client the
// /products/[...slug] route pattern (optimistic route discovery). A link whose
// href is a `redirects()` source and that is prefetched afterwards is then
// predicted from that learned pattern instead of being resolved: the predicted
// tree describes a product page, while the response the server sends (after
// following the 308) is the category page. The predicted segments can never be
// fulfilled, so the pending prefetch task keeps re-issuing the identical
// request - thousands of RSC requests per redirected link, indefinitely.
//
// Only the default (non-Cache-Components) prefetching path loops; with
// __NEXT_CACHE_COMPONENTS=true the prefetch settles and this test passes.
describe('redirect-source-prefetch-loop', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })

  if (isNextDev) {
    // Only reproduces in a production build; dev does not predict routes from
    // a learned pattern (it resolves routes on demand).
    test('skipped in dev mode', () => {})
    return
  }

  const LIVE_LINKS = [
    '/products/live-1',
    '/products/live-2',
    '/products/live-3',
    '/products/live-4',
  ]
  const REDIRECTED_LINKS = ['/products/retired-1', '/products/retired-2']

  // How long to watch for repeated prefetches after the redirected links have
  // been revealed. On a buggy build each redirected link is re-requested
  // ~100 times per second, so this window is long enough to be unambiguous.
  const OBSERVATION_WINDOW_MS = 5000
  // A redirected prefetch costs one request, plus the redirected one; allow a
  // little slack for retries without allowing a loop.
  const MAX_REQUESTS_PER_PATH = 5

  it('does not loop prefetches for a link whose href is a redirects() source', async () => {
    const rscRequestCounts = new Map<string, number>()

    const browser = await next.browser('/categories/wine', {
      beforePageLoad(page: Page) {
        page.on('request', (request: Request) => {
          if (request.headers()['rsc'] === undefined) {
            return
          }
          const pathname = new URL(request.url()).pathname
          rscRequestCounts.set(
            pathname,
            (rscRequestCounts.get(pathname) ?? 0) + 1
          )
        })
      },
    })

    expect(await browser.elementById('category-heading').text()).toBe(
      'category: wine'
    )

    // Reveal the live product links first. Their prefetches teach the client
    // the /products/[...slug] route pattern.
    for (const href of LIVE_LINKS) {
      await browser.elementByCss(`input[data-link-accordion="${href}"]`).click()
    }
    await browser.waitForIdleNetwork()

    // Now reveal the links whose hrefs are `redirects()` sources, and count
    // every RSC request issued from this point on.
    const countsBefore = new Map(rscRequestCounts)
    for (const href of REDIRECTED_LINKS) {
      await browser.elementByCss(`input[data-link-accordion="${href}"]`).click()
    }
    await new Promise((resolve) => setTimeout(resolve, OBSERVATION_WINDOW_MS))

    const loopingPaths: Record<string, number> = {}
    for (const [pathname, count] of rscRequestCounts) {
      const requests = count - (countsBefore.get(pathname) ?? 0)
      if (requests > MAX_REQUESTS_PER_PATH) {
        loopingPaths[pathname] = requests
      }
    }
    // Pre-fix this reports ~500 requests each for /products/retired-1 and
    // /products/retired-2 within the observation window.
    expect(loopingPaths).toEqual({})

    // The redirected link still navigates to the redirect destination.
    await browser.elementByCss('a[href="/products/retired-1"]').click()
    await retry(async () => {
      expect(await browser.elementById('category-heading').text()).toBe(
        'category: wine/red'
      )
    })
    expect(new URL(await browser.url()).pathname).toBe('/categories/wine/red')
  })
})
