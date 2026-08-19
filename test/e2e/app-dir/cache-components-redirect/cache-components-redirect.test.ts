import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('cache-components - redirect after an await', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should redirect on a direct navigation to the page', async () => {
    const browser = await next.browser('/gated')

    await retry(async () => {
      expect(await browser.url()).toEndWith('/destination')
    })
    expect(await browser.elementByCss('#destination').text()).toBe(
      'destination page'
    )
  })

  it('should redirect on a client-side navigation to the page', async () => {
    const browser = await next.browser('/start')
    await browser.elementById('to-gated').click()

    await retry(async () => {
      expect(await browser.url()).toEndWith('/destination')
    })
    expect(await browser.elementByCss('#destination').text()).toBe(
      'destination page'
    )
  })
})
