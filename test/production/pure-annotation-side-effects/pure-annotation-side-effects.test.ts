import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('pure annotation side effects', () => {
  const { next } = nextTestSetup({ files: __dirname })

  it('should keep the side effects of invoking the result of a `/* @__PURE__ */` annotated call', async () => {
    const browser = await next.browser('/')

    await retry(async () => {
      expect(await browser.elementByCss('#result').text()).toBe(
        'ticks 1 / callback 1'
      )
    })
  })
})
