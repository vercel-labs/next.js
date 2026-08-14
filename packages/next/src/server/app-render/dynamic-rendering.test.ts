/**
 * @jest-environment node
 */

import { runInNewContext } from 'node:vm'
import { setFlagsFromString } from 'node:v8'
import {
  abortOnSynchronousPlatformIOAccess,
  isPrerenderInterruptedError,
} from './dynamic-rendering'
import type { PrerenderStoreModern } from './work-unit-async-storage.external'

setFlagsFromString('--expose-gc')
const forceGarbageCollection = runInNewContext('gc') as () => void

describe('abortOnSynchronousPlatformIOAccess', () => {
  it('aborts with a prerender interrupted error', () => {
    const controller = new AbortController()

    abortOnSynchronousPlatformIOAccess(
      '/interrupted',
      'Date.now()',
      new Error('sync io'),
      {
        controller,
        dynamicTracking: null,
      } as unknown as PrerenderStoreModern
    )

    expect(controller.signal.aborted).toBe(true)
    expect(isPrerenderInterruptedError(controller.signal.reason)).toBe(true)
  })

  // Regression test for https://github.com/vercel/next.js/issues/97348: the
  // abort reason is an `Error` created inside the render frame. V8 keeps that
  // error's structured (not yet formatted) stack trace alive until `.stack` is
  // read, and each retained frame pins the aborting closure's context, i.e. the
  // render's whole working set, for as long as the `AbortSignal` is reachable.
  it('does not retain the aborting render frame through the abort reason', async () => {
    const { signal, payloadRef } = abortPrerenderFromRenderFrame()

    expect(signal.aborted).toBe(true)

    await expectCollected(payloadRef)

    // The signal (and therefore its reason) is still reachable here, which is
    // what makes the retention above observable in the first place.
    expect(isPrerenderInterruptedError(signal.reason)).toBe(true)
  })
})

/**
 * Aborts a prerender from a closure that holds a render working set, mirroring
 * how `abortOnSynchronousPlatformIOAccess` is called while rendering a route.
 * Everything except the signal is dropped when this returns.
 */
function abortPrerenderFromRenderFrame(): {
  signal: AbortSignal
  payloadRef: WeakRef<object>
} {
  const controller = new AbortController()
  // Stands in for a cached page value held by the render frame.
  const payload = {
    html: 'x'.repeat(1024),
    segmentData: new Map<string, Uint8Array>([['/', new Uint8Array(1024)]]),
  }
  const payloadRef = new WeakRef(payload)

  // The abort happens inside a closure over the working set, so the frame
  // captured by the abort reason's stack trace references `payload`.
  const renderFrame = () => {
    if (payload.segmentData.size === 0) {
      throw new Error('unreachable')
    }

    abortOnSynchronousPlatformIOAccess(
      '/retention',
      'Date.now()',
      new Error('sync io'),
      {
        controller,
        dynamicTracking: null,
      } as unknown as PrerenderStoreModern
    )
  }

  renderFrame()

  return { signal: controller.signal, payloadRef }
}

async function expectCollected(ref: WeakRef<object>): Promise<void> {
  for (let attempt = 0; attempt < 10; attempt++) {
    forceGarbageCollection()
    await new Promise<void>((resolve) => setImmediate(resolve))
  }

  expect(ref.deref()).toBeUndefined()
}
