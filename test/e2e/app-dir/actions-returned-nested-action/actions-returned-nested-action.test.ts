import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('actions - returned nested action', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it.each(['/imported', '/prop'])(
    'should call a nested inline action returned by a file-level action (%s)',
    async (pathname) => {
      const browser = await next.browser(pathname)

      await browser.elementByCss('#get-inner').click()
      await retry(async () => {
        expect(await browser.elementByCss('#status').text()).toBe(
          'stored:function'
        )
      })

      await browser.elementByCss('#call-inner').click()
      await retry(async () => {
        expect(await browser.elementByCss('#status').text()).toBe(
          'result:captured:client'
        )
      })
    }
  )
})
