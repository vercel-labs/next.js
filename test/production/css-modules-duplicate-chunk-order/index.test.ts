import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

// A CSS module (`tile.module.css`) that is used by both a statically imported
// and a dynamically imported component is emitted into two CSS chunks. When the
// chunk of the dynamically imported component is loaded first, its duplicated
// copy of `.wrapper` stays in `<head>` after the client-side navigation and
// wins over the page CSS, so the override in `red-tile.module.css` is lost.
// x-ref: https://github.com/vercel/next.js/issues/42082
describe('css modules - duplicated rules across css chunks', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should apply the overriding css module rule on a direct request', async () => {
    const browser = await next.browser('/to')

    expect(
      await browser.elementByCss('#tile').getComputedCss('background-color')
    ).toBe('rgb(220, 20, 60)')
  })

  it('should apply the overriding css module rule after client navigation from a route with a duplicated css chunk', async () => {
    const browser = await next.browser('/lazy')

    // Make sure the CSS chunk of the dynamically imported component is loaded
    // before navigating away.
    await browser.waitForElementByCss('#tile')

    await browser.elementByCss('#to-link').click()

    await retry(async () => {
      expect(await browser.elementByCss('#tile').text()).toBe('Red Background')
      expect(
        await browser.elementByCss('#tile').getComputedCss('background-color')
      ).toBe('rgb(220, 20, 60)')
    })
  })
})
