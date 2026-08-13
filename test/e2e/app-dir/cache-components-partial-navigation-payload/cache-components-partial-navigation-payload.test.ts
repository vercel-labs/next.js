import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('cache-components - partial RSC payload during navigation', () => {
  const { next, isNextDev } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (isNextDev) {
    // Dev doesn't prerender, so there is no partial (`~`-marked) payload to
    // serve to a navigation.
    it('is skipped in dev', () => {})
    return
  }

  it('recovers instead of crashing when a navigation receives a partial payload', async () => {
    const pageErrors: string[] = []
    const partialPayloads: string[] = []

    const browser = await next.browser('/', {
      beforePageLoad(page) {
        page.on('pageerror', (error: Error) => {
          pageErrors.push(error.message)
        })

        // Emulate a shared cache in front of the app that replays the
        // *prefetch* response of a partially prerendered route for a
        // *navigation* RSC request. Prefetch payloads are partial by design
        // (their first byte is the `~` marker), and the navigation reader
        // cannot render one: the rows that are still pending when the stream
        // ends reject during render.
        page.route('**/target*', async (route) => {
          const headers = route.request().headers()

          if (headers['rsc'] !== '1' || headers['next-router-prefetch']) {
            return route.continue()
          }

          const prefetchResponse = await route.fetch({
            headers: { ...headers, 'next-router-prefetch': '2' },
          })
          const body = await prefetchResponse.body()

          partialPayloads.push(String.fromCharCode(body[0]))

          await route.fulfill({
            status: prefetchResponse.status(),
            headers: prefetchResponse.headers(),
            body,
          })
        })
      },
    })

    await browser.elementByCss('#go').click()

    // The navigation must not dead-end. Recovering with a full browser
    // navigation renders the route just like a direct request does, instead
    // of showing the terminal "This page couldn't load" screen.
    await retry(async () => {
      const text = await browser.eval(() => document.body.innerText)
      expect(text).toContain('Target')
      expect(text).toContain('dynamic content resolved')
    }, 10_000)

    // Sanity check: the intercepted payload really was the partial one.
    expect(partialPayloads).toEqual(['~'])

    // Consuming the payload must not surface as an uncaught error
    // (React error #412, "Connection closed.").
    expect(pageErrors).toEqual([])
  })
})
