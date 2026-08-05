import { nextTestSetup } from 'e2e-utils'
import { waitFor } from 'next-test-utils'

describe('on-request-error - client-abort-rsc-stream', () => {
  const { next, skipped } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('should not report a client abort of a streaming RSC response to onRequestError', async () => {
    const outputIndex = next.cliOutput.length
    const controller = new AbortController()

    const res = await next.fetch('/stream', {
      headers: { RSC: '1' },
      signal: controller.signal,
    })

    expect(res.status).toBe(200)

    // Wait for the first flushed chunk of the RSC stream, then abort the
    // request like a client that navigated away would.
    await new Promise<void>((resolve, reject) => {
      res.body.once('data', () => resolve())
      res.body.once('error', reject)
    })

    controller.abort()

    // Give the server time to process the disconnect.
    await waitFor(2000)

    const cliOutput = next.cliOutput.slice(outputIndex)

    expect(cliOutput).not.toContain('The destination stream closed early')
    expect(cliOutput).not.toContain('ON_REQUEST_ERROR')
  })
})
