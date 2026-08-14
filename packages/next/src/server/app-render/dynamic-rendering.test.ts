import vm from 'node:vm'
import v8 from 'node:v8'

import { abortOnSynchronousPlatformIOAccess } from './dynamic-rendering'
import type { PrerenderStoreModern } from './work-unit-async-storage.external'

function createPrerenderStore(): PrerenderStoreModern {
  return {
    type: 'prerender',
    controller: new AbortController(),
    dynamicTracking: null,
  } as unknown as PrerenderStoreModern
}

function abortWithSynchronousPlatformIO(prerenderStore: PrerenderStoreModern) {
  abortOnSynchronousPlatformIOAccess(
    '/p/[slug]',
    '`Date.now()`',
    new Error(),
    prerenderStore
  )
}

describe('the prerender abort reason', () => {
  it('is still recognizable as a prerender interrupted error', () => {
    const prerenderStore = createPrerenderStore()
    abortWithSynchronousPlatformIO(prerenderStore)

    const reason = prerenderStore.controller.signal.reason
    expect(reason).toBeInstanceOf(Error)
    expect(reason.digest).toBe('NEXT_PRERENDER_INTERRUPTED')
    expect(reason.message).toBe(
      'Route /p/[slug] needs to bail out of prerendering at this point because it used `Date.now()`.'
    )
  })

  // V8 keeps an Error's structured stack trace (an internal array of
  // CallSiteInfo) alive until `.stack` is read. Every retained frame pins the
  // frame's function, its context, and therefore the whole working set of the
  // render that aborted. Since the abort reason outlives the render on
  // `AbortSignal.reason`, it must not carry frames.
  it('does not carry captured stack frames', () => {
    const prerenderStore = createPrerenderStore()
    abortWithSynchronousPlatformIO(prerenderStore)

    const reason = prerenderStore.controller.signal.reason
    expect(reason.stack).not.toMatch(/\n\s*at\s/)
  })

  it('does not retain the aborting render frames while the signal is alive', () => {
    // The unit test process is not necessarily started with --expose-gc.
    v8.setFlagsFromString('--expose-gc')
    const gc = vm.runInNewContext('gc') as () => void
    const collect = () => {
      gc()
      gc()
    }

    const MB = 1024 * 1024
    const PAYLOAD_SIZE = 8 * MB
    const RENDERS = 10

    const externalMB = () => Math.round(process.memoryUsage().arrayBuffers / MB)

    function render(): AbortSignal {
      const prerenderStore = createPrerenderStore()
      // Mirrors a render's working set: the cached page value and its
      // per-segment RSC buffers.
      const segmentData = new Map([
        ['/_full', Buffer.allocUnsafe(PAYLOAD_SIZE)],
      ])
      const page = { segmentData }

      const abortFromInsideTheRenderFrame = () => {
        // `page` is in this frame's context, like the React renderer and user
        // component frames that are on the stack when a synchronous platform
        // IO access aborts a prerender.
        if (page.segmentData.size !== 1) throw new Error('unreachable')
        abortWithSynchronousPlatformIO(prerenderStore)
      }
      abortFromInsideTheRenderFrame()

      // The render is over, everything but the signal is dropped.
      return prerenderStore.controller.signal
    }

    collect()
    const before = externalMB()
    const signals: AbortSignal[] = []
    for (let i = 0; i < RENDERS; i++) {
      signals.push(render())
    }
    collect()
    const retained = externalMB() - before
    signals.length = 0
    collect()

    // Without frames on the reason only the last render can still be alive.
    expect(retained).toBeLessThan((RENDERS * PAYLOAD_SIZE) / MB / 2)
  })
})
