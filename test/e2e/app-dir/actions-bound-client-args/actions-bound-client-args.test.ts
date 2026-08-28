import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('app-dir action bound args in client component', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should submit a progressively enhanced form when the action is bound in a client component', async () => {
    let actionStatus: number | undefined

    const browser = await next.browser('/', {
      disableJavaScript: true,
      beforePageLoad(page) {
        page.on('response', (response) => {
          if (response.request().method() === 'POST') {
            actionStatus = response.status()
          }
        })
      },
    })

    await browser.elementById('name-input').type('test')
    await browser.eval(`document.getElementById('form').submit()`)

    await retry(async () => {
      expect(await browser.elementById('form-state').text()).toBe(
        'Updated client-user to test'
      )
    }, 10_000)

    expect(actionStatus).toBe(200)
  })
})
