import { nextTestSetup } from 'e2e-utils'

const REQUEST_TIMEOUT_MS = 20_000

describe('use-in-async-server-component', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('should not hang the request when use() is called in an async server component', async () => {
    const cliOutputLength = next.cliOutput.length
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    let timedOut = false
    let html = ''

    try {
      const res = await fetch(`${next.url}/`, { signal: controller.signal })
      html = await res.text()
    } catch (err) {
      if (controller.signal.aborted) {
        timedOut = true
      } else {
        throw err
      }
    } finally {
      clearTimeout(timeout)
    }

    // The response must finish streaming instead of being stuck on the
    // suspense fallback forever.
    expect(timedOut).toBe(false)
    expect(html).not.toBe('')

    if (isNextDev) {
      // React must not report an internal error for this user mistake.
      expect(next.cliOutput.slice(cliOutputLength)).not.toContain(
        'This is a bug in React'
      )
    }
  })
})
