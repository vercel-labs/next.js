import { nextTestSetup } from 'e2e-utils'
import { retry, waitFor } from 'next-test-utils'

// Regression test for https://github.com/vercel/next.js/issues/97036: with
// `cacheComponents` enabled, interrupting a still-suspended client navigation
// and then restoring that history entry with back/forward left a layout
// Suspense fallback on screen that never resolved, with nothing in flight.
describe('cache-components-interrupted-nav-bfcache', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('resolves the layout Suspense fallback of an interrupted navigation that is restored via back/forward', async () => {
    // Warm up all routes so that on-demand compilation in dev doesn't
    // interfere with the timing of the interrupted navigation below.
    await next.render('/b')
    await next.render('/c')

    const browser = await next.browser('/a')

    await retry(async () => {
      expect(
        await browser.elementByCss('[data-nav-rail="a"]').text()
      ).toContain('nav rail a')
    })

    // Counts the section layouts' Suspense fallbacks that are currently
    // rendered and visible to the user. Fallbacks inside a hidden
    // (`display: none`) back/forward-cache <Activity> subtree don't count,
    // only a fallback the user actually sees is a visible hang.
    const countVisibleFallbacks = () =>
      browser.eval(`
        Array.prototype.filter.call(
          document.querySelectorAll('[data-nav-fallback]'),
          (element) =>
            element.offsetParent !== null ||
            element.getClientRects().length > 0
        ).length
      `) as Promise<number>

    for (let round = 0; round < 3; round++) {
      // Start navigating to /b, then interrupt it with a navigation to /c
      // while the section layout of /b is still suspended.
      await browser.elementById('link-b').click()
      await waitFor(250)
      await browser.elementById('link-c').click()
      await waitFor(300)

      // Go back to the interrupted history entry and then forward again,
      // which restores it from the router's back/forward cache.
      await browser.back()
      await waitFor(300)
      await browser.forward()

      await retry(async () => {
        expect(
          await browser.elementByCss('[data-nav-rail="c"]').text()
        ).toContain('nav rail c')
      })

      // Restoring the interrupted entry must not leave a Suspense fallback on
      // screen that never resolves. Before this was fixed, every round leaked
      // one more permanently visible fallback, with nothing left in flight.
      await retry(async () => {
        expect(await countVisibleFallbacks()).toBe(0)
      }, 10000)
    }
  })
})
