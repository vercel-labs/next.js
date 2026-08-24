import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import type * as Playwright from 'playwright'

describe('polyfills - module capable browsers', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should polyfill Set methods in browsers that support modules but lack them', async () => {
    const browser = await next.browser('/', {
      // Simulate a browser like Chrome 103: it supports ES modules (so
      // `<script nomodule>` is ignored) but does not implement the newer
      // `Set` methods.
      beforePageLoad(page: Playwright.Page) {
        return page.addInitScript(() => {
          // @ts-expect-error -- removing an optional built-in method
          delete Set.prototype.union
        })
      },
    })

    await browser.waitForElementByCss('#result')

    await retry(async () => {
      expect(await browser.elementByCss('#result').text()).toBe('3')
    })
  })
})
