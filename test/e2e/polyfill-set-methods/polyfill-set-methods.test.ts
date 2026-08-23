import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('polyfill-set-methods', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  // https://github.com/vercel/next.js/issues/74978
  it('should polyfill extended Set methods in module-capable browsers', async () => {
    const browser = await next.browser('/', {
      beforePageLoad(page) {
        // Simulate a browser that supports ES modules (so it ignores the
        // `nomodule` polyfill bundle) but does not implement the ES2025 Set
        // methods, e.g. Chrome 103.
        return page.addInitScript('delete Set.prototype.union')
      },
    })

    expect(await browser.eval('typeof Set.prototype.union')).toBe('function')

    await retry(async () => {
      expect(await browser.elementByCss('#result').text()).toBe('4')
    })
  })
})
