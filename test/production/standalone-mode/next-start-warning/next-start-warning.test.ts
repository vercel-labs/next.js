import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('standalone mode: next start warning', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
  })

  beforeAll(async () => {
    const { exitCode } = await next.build()
    expect(exitCode).toBe(0)
    await next.start({ skipBuild: true })
  })

  it('should serve the regular build, including server actions', async () => {
    const browser = await next.browser('/')
    expect(await browser.elementByCss('#count').text()).toBe('count: 0')

    await browser.elementByCss('button').click()

    await retry(async () => {
      expect(await browser.elementByCss('#count').text()).toBe('count: 1')
    })
  })

  it('should not claim that "next start" does not work with output: standalone', async () => {
    await retry(() => {
      // the warning is printed lazily when the server is created
      expect(next.cliOutput).toContain('.next/standalone/server.js')
    })

    // `next start` does work with `output: 'standalone'`, it just serves the
    // regular `.next` build instead of the standalone output.
    expect(next.cliOutput).not.toContain(
      `"next start" does not work with "output: standalone" configuration.`
    )
  })
})
