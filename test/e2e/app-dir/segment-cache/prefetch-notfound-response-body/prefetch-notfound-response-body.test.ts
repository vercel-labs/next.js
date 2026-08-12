import { nextTestSetup } from 'e2e-utils'
import { retry, waitFor } from 'next-test-utils'
import type * as Playwright from 'playwright'

// Regression test for https://github.com/vercel/next.js/issues/96801
//
// When the segment cache decides not to use a prefetch response — e.g. because
// the target page called `notFound()` — it drops the response without reading
// or cancelling its body. An abandoned body keeps the request in flight in the
// browser: the request never finalizes, its connection is never released, and
// the page never reaches network idle.
describe('segment cache prefetch of an ISR notFound() page', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
  })
  if (isNextDev) {
    test('skipped in development', () => {})
    return
  }

  it('does not leave the prefetch request in flight', async () => {
    const startedRequests = new Set<Playwright.Request>()
    const settledRequests = new Set<Playwright.Request>()

    const browser = await next.browser('/', {
      beforePageLoad(page: Playwright.Page) {
        page.on('request', (request) => {
          if (request.url().includes('/card/missing')) {
            startedRequests.add(request)
          }
        })
        page.on('requestfinished', (request) => settledRequests.add(request))
        page.on('requestfailed', (request) => settledRequests.add(request))
      },
    })

    // The first visit's prefetch renders the notFound() page and caches it.
    await waitFor(1500)
    startedRequests.clear()
    settledRequests.clear()

    // On the second visit the prefetch is served from that cached entry, and
    // the segment cache rejects the response.
    await browser.refresh()

    await retry(async () => {
      expect(startedRequests.size).toBeGreaterThan(0)
    })

    // Whether the segment cache uses the prefetch response or rejects it, the
    // request must complete instead of wedging a connection forever.
    await retry(
      async () => {
        const stillInFlight = Array.from(startedRequests)
          .filter((request) => !settledRequests.has(request))
          .map((request) => request.url())
        expect(stillInFlight).toEqual([])
      },
      10000,
      500,
      'waiting for the prefetch requests to complete'
    )
  })
})
