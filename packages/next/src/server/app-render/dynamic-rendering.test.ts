/**
 * @jest-environment node
 */

import { runInNewContext } from 'node:vm'
import { setFlagsFromString } from 'node:v8'
import { abortOnSynchronousPlatformIOAccess } from './dynamic-rendering'
import type { PrerenderStoreModern } from './work-unit-async-storage.external'

setFlagsFromString('--expose-gc')
const forceGarbageCollection = runInNewContext('gc') as () => void

// The error that reports the sync IO access is created outside of the render
// frame, so that it can't be the thing retaining the render's closure graph.
const errorWithStack = new Error('sync IO access')

/**
 * Aborts a prerender the same way a synchronous platform IO access does, from
 * inside a frame that closes over a large payload (mirroring a render frame
 * that holds on to the cached page value and its `segmentData`). Only the
 * `AbortSignal` survives, as in production.
 */
function prerenderAndAbort(): {
  signal: AbortSignal
  payloadRef: WeakRef<object>
} {
  const payload = { segmentData: new Map([['/_full', new Uint8Array(1024)]]) }
  const payloadRef = new WeakRef(payload)
  const controller = new AbortController()
  const prerenderStore = {
    type: 'prerender',
    controller,
    dynamicTracking: null,
  } as unknown as PrerenderStoreModern

  const abortFromInsideRenderFrame = () => {
    // Reference the payload so that it lives in this frame's context.
    expect(payload.segmentData.size).toBe(1)

    abortOnSynchronousPlatformIOAccess(
      '/x',
      'Date.now()',
      errorWithStack,
      prerenderStore
    )
  }

  abortFromInsideRenderFrame()

  return { signal: controller.signal, payloadRef }
}

async function expectCollected(ref: WeakRef<object>): Promise<void> {
  for (let attempt = 0; attempt < 10; attempt++) {
    forceGarbageCollection()
    await new Promise<void>((resolve) => setImmediate(resolve))
  }

  expect(ref.deref()).toBeUndefined()
}

describe('abortOnSynchronousPlatformIOAccess', () => {
  it('does not retain the aborted render through the abort reason', async () => {
    const { signal, payloadRef } = prerenderAndAbort()

    expect(signal.aborted).toBe(true)
    expect((signal.reason as { digest?: string }).digest).toBe(
      'NEXT_PRERENDER_INTERRUPTED'
    )

    // The retained `AbortSignal.reason` error must not keep the render frames
    // (and therefore the whole render closure graph) alive.
    await expectCollected(payloadRef)
  })
})
