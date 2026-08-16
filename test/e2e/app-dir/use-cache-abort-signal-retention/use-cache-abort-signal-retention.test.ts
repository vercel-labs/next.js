import { nextTestSetup } from 'e2e-utils'
import type { CompositeSignalStats } from './instrumentation'

describe('use-cache-abort-signal-retention', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    // The instrumentation hook records composite abort signals in the server
    // process, which requires access to a single long-running server.
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  if (isNextDev) {
    // Only prerenders create the composite abort signal.
    it('does not apply to dev', () => {})

    return
  }

  it('should not keep abort listeners attached to the composite signal after a "use cache" prerender has finished', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await next.fetch(`/p/slug-${i}`)
      expect(response.status).toBe(200)
    }

    const stats: CompositeSignalStats = await next
      .fetch('/composite-signals')
      .then((response) => response.json())

    // Sanity check that the composite signals were created at all. Otherwise
    // the assertion below would trivially pass.
    expect(stats.created).toBeGreaterThan(0)

    // Node keeps a composite signal created by `AbortSignal.any()` in its
    // process-global `gcPersistentSignals` set for as long as an abort listener
    // is attached to it. If the listener that `prerender()` attaches is not
    // removed after the cached render has finished, the whole cache entry is
    // retained through the listener's closure.
    expect(stats.withAbortListeners).toBe(0)
  })
})
