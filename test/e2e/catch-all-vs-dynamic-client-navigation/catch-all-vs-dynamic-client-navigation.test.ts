import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

// A concrete three segment URL that is only prerendered by the catch-all route
// `/[category-slug]/[...rest]`, while the sibling nested dynamic route
// `/[category-slug]/[collection-slug]/[product-slug]` matches the same pattern.
const url = '/hair/shop-by-hair-type/dry-scalp'

describe('catch-all vs nested dynamic route client navigation', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should render the catch-all route on a server request', async () => {
    const $ = await next.render$(url)
    expect($('#page').text()).toBe('catch-all')
  })

  it.each(['push', 'link'] as const)(
    'should render the catch-all route after client navigation via %s',
    async (kind) => {
      const browser = await next.browser('/')
      await browser.elementByCss(`#to-catch-all-${kind}`).click()

      await retry(async () => {
        expect(await browser.elementByCss('#params').text()).toContain('hair')
      })

      // The mounted component and the data it renders have to come from the
      // same route as the server would resolve for this URL.
      expect(await browser.elementByCss('#page').text()).toBe('catch-all')
      expect(JSON.parse(await browser.elementByCss('#params').text())).toEqual({
        'category-slug': 'hair',
        rest: ['shop-by-hair-type', 'dry-scalp'],
      })
    }
  )
})
