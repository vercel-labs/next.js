import { nextTestSetup } from 'e2e-utils'
import { retry, waitFor } from 'next-test-utils'

// Regression test for https://github.com/vercel/next.js/issues/97036
describe('cache-components - interrupted navigation restored with back/forward', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  // Returns the `data-fallback` value of every Suspense fallback that is
  // currently visible on the page.
  function getVisibleFallbacks(
    browser: Awaited<ReturnType<typeof next.browser>>
  ) {
    return browser.eval(() =>
      Array.from(document.querySelectorAll('[data-fallback]'))
        .filter(
          (element) => (element as HTMLElement).getClientRects().length > 0
        )
        .map((element) => element.getAttribute('data-fallback'))
    )
  }

  it('does not get stuck in a layout Suspense fallback', async () => {
    const browser = await next.browser('/a')
    await browser.elementByCss('[data-navrail="a"]')

    // Two rounds are needed: the first one puts the interrupted route into the
    // client-side back/forward cache, the second one restores it.
    for (let round = 0; round < 2; round++) {
      // Navigate to /b, and interrupt it while the layout of /b is still
      // suspended by navigating to /c instead.
      await browser.elementById('link-b').click()
      await waitFor(250)
      await browser.elementById('link-c').click()
      await waitFor(300)

      // Go back to the interrupted entry, then forward again.
      await browser.back()
      await waitFor(300)
      await browser.forward()
      await waitFor(3000)
    }

    // Every fallback that is on screen must eventually be replaced by its
    // content. The bug leaves the interrupted-then-restored navigation
    // committed into a layout Suspense fallback that never resolves, with no
    // pending work left that could resolve it.
    await retry(async () => {
      expect(await getVisibleFallbacks(browser)).toEqual([])
    }, 10_000)

    expect(await browser.elementByCss('[data-page="c"]').text()).toBe(
      'page c content'
    )
  })
})
