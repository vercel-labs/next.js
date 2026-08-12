import { nextTestSetup } from 'e2e-utils'

describe('node-env-development-build', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    env: { NODE_ENV: 'development' },
  })

  it('should build successfully when NODE_ENV is set to development', async () => {
    const { exitCode, cliOutput } = await next.build()

    // A `NODE_ENV=development` build used to compile successfully and then
    // crash while prerendering Next.js' built-in `/_global-error` page with
    // "TypeError: Cannot read properties of null (reading 'useContext')".
    expect(cliOutput).not.toContain('Error occurred prerendering page')
    expect(cliOutput).not.toContain(
      "Cannot read properties of null (reading 'useContext')"
    )
    expect(exitCode).toBe(0)
  })
})
