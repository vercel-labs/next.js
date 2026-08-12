import { nextTestSetup } from 'e2e-utils'

describe('cacheComponents - missing next.config at runtime', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    // The deployment target always has the config available.
    skipDeployment: true,
  })

  if (skipped) return

  beforeAll(async () => {
    await next.build()

    // Emulate a Docker runner stage that copies the build output but not the
    // Next.js config file, see https://github.com/vercel/next.js/issues/96806.
    // The build output itself records `cacheComponents` in
    // `.next/required-server-files.json`.
    await next.deleteFile('next.config.js')

    await next.start({ skipBuild: true })
  })

  it('serves a dynamic headers() page from a cacheComponents build', async () => {
    const res = await next.fetch('/')

    expect(res.status).toBe(200)

    const html = await res.text()
    expect(html).toContain('static shell')
    expect(html).toContain('user-agent:')

    expect(next.cliOutput).not.toContain('DYNAMIC_SERVER_USAGE')
  })
})
