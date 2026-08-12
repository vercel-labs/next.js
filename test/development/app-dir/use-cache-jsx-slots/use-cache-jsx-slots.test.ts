import { nextTestSetup } from 'e2e-utils'

describe('use-cache-jsx-slots', () => {
  const { next } = nextTestSetup({ files: __dirname })

  it('should not warn about missing keys for JSX props passed to a "use cache" component', async () => {
    const browser = await next.browser('/')

    expect(await browser.elementById('nav').text()).toBe('nav hole')
    expect(await browser.elementById('body').text()).toBe('body hole')

    expect(next.cliOutput).not.toContain(
      'Each child in a list should have a unique "key" prop'
    )
  })
})
