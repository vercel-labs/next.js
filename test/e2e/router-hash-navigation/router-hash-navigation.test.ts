import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('router hash navigation', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      react: '19.3.0-canary-fef12a01-20260413',
      'react-dom': '19.3.0-canary-fef12a01-20260413',
    },
    // Vercel deployment fails to build/deploy this fixture in CI; skip in deploy mode.
    skipDeployment: true,
  })

  it('scrolls to top when href="/" and url already contains a hash', async () => {
    const browser = await next.browser('/#section')
    expect(await browser.eval(() => window.scrollY)).not.toBe(0)
    await browser.elementByCss('#top-link').click()
    expect(await browser.eval(() => window.scrollY)).toBe(0)
    await browser.close()
  })

  // Reference behavior for the test below: clicking a native anchor moves focus
  // to the fragment target.
  it('focuses the fragment target when clicking a native anchor', async () => {
    const browser = await next.browser('/fragment-focus')
    await browser.elementByCss('#anchor-to-fragment').click()

    await retry(async () => {
      expect(await browser.eval(() => document.activeElement.id)).toBe(
        'focus-target'
      )
    })
    await browser.close()
  })

  it('focuses the fragment target when clicking a next/link', async () => {
    const browser = await next.browser('/fragment-focus')
    await browser.elementByCss('#link-to-fragment').click()

    await retry(async () => {
      expect(await browser.eval(() => window.location.hash)).toBe(
        '#focus-target'
      )
    })
    // Should match the native anchor behavior asserted above.
    await retry(async () => {
      expect(await browser.eval(() => document.activeElement.id)).toBe(
        'focus-target'
      )
    })
    await browser.close()
  })
})
