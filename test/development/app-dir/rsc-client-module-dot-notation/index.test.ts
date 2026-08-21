import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('app-dir - rsc client module dot notation', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should explain that you cannot dot into a client module from a server component', async () => {
    const res = await next.fetch('/')
    expect(res.status).toBe(500)

    await retry(async () => {
      expect(next.cliOutput).toContain(
        'You cannot dot into a client module from a server component'
      )
    })
  })
})
