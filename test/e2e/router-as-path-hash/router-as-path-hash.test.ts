import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('router.asPath hash fragment', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('does not include the hash fragment on the client', async () => {
    // the hash fragment is never sent to the server
    const html = await next.render('/')
    expect(html).toContain('id="as-path">/<')
    expect(html).toContain('id="has-hash">false<')

    const browser = await next.browser('/#my-subheading')
    // wait for hydration so we assert on the client-side router value
    await retry(async () => {
      expect(await browser.elementByCss('#hydrated').text()).toBe('true')
    })

    expect(await browser.elementByCss('#as-path').text()).toBe('/')
    expect(await browser.elementByCss('#has-hash').text()).toBe('false')

    await browser.close()
  })
})
