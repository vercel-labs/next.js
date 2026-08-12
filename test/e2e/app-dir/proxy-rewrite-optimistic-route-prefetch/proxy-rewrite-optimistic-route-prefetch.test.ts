import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import { createRouterAct } from 'router-act'
import type { Page, Request, Response } from 'playwright'

const NEXT_ROUTER_SEGMENT_PREFETCH_HEADER = 'next-router-segment-prefetch'

// The page segment path of the home route (`/[locale]/page`). Requesting it at
// a URL that the proxy rewrites to the catch-all route
// (`/[locale]/[...slug]/page`) is nonsense: that segment does not exist there,
// and the server correctly answers 404.
const HOME_PAGE_SEGMENT = '/$d$locale/__PAGE__'

describe('proxy-rewrite-optimistic-route-prefetch', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })

  if (isNextDev) {
    // Optimistic routing only predicts routes from learned patterns in a
    // production build; dev resolves routes on demand.
    test('skipped in dev mode', () => {})
    return
  }

  it("does not prefetch another route shape's segment path for a proxy-rewritten link", async () => {
    let act: ReturnType<typeof createRouterAct>

    // Every segment prefetch, and the URL it was requested at.
    const segmentPrefetches: Array<{
      pathname: string
      segment: string
      status: number
    }> = []

    const browser = await next.browser('/', {
      beforePageLoad(page: Page) {
        act = createRouterAct(page)
        page.on('response', (response: Response) => {
          const request: Request = response.request()
          const segment = request.headers()[
            NEXT_ROUTER_SEGMENT_PREFETCH_HEADER
          ] as string | undefined
          if (segment === undefined) {
            return
          }
          segmentPrefetches.push({
            pathname: new URL(request.url()).pathname,
            segment,
            status: response.status(),
          })
        })
      },
    })

    // The initial page is `/`, which the proxy rewrites to `/de` — the home
    // route. Its URL parts don't line up with the filesystem route, so no
    // route pattern is learned from it.
    expect(await browser.elementById('home').text()).toBe('home:de:end')

    // Reveal the `/en` link. It is *not* rewritten, so its URL parts line up
    // with `/[locale]` and the client learns a pattern for one-part URLs that
    // maps to the home route shape.
    await act(async () => {
      const toggle = await browser.elementByCss(
        'input[data-link-accordion="/en"]'
      )
      await toggle.click()
    })

    // Reveal the `/alpha` link. It has the same number of URL parts as `/en`,
    // so it matches the learned pattern — but the proxy rewrites it to
    // `/de/alpha`, which resolves to the catch-all route, a different shape.
    // The client cannot know that from the URL, so it must ask the server for
    // the route tree instead of predicting it. Pre-fix, it predicted the home
    // route shape and requested that route's page segment at `/alpha`, which
    // the server answered with 404 (`act` rejects on any error status code).
    await act(async () => {
      const toggle = await browser.elementByCss(
        'input[data-link-accordion="/alpha"]'
      )
      await toggle.click()
    })

    // The sharpest signal of the bug: no prefetch ever asked for the home
    // route's page segment at a URL that isn't the home route.
    expect(
      segmentPrefetches.filter(
        (entry) =>
          entry.segment === HOME_PAGE_SEGMENT && entry.pathname === '/alpha'
      )
    ).toEqual([])
    expect(segmentPrefetches.filter((entry) => entry.status !== 200)).toEqual(
      []
    )

    // The link still navigates to the rewritten catch-all route. (Not wrapped
    // in `act`: with a correct prefetch the navigation is served entirely from
    // the prefetch cache and issues no request.)
    const link = await browser.elementByCss('a[href="/alpha"]')
    await link.click()
    await retry(async () => {
      expect(await browser.elementById('catch-all').text()).toBe(
        'catch-all:de:alpha:end'
      )
    })
  })
})
