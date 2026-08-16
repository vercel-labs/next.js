import { getEventListeners } from 'node:events'

export type CompositeSignalStats = {
  created: number
  withAbortListeners: number
}

declare global {
  var __compositeSignals: AbortSignal[] | undefined
}

export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  const compositeSignals: AbortSignal[] = (globalThis.__compositeSignals = [])
  const originalAny = AbortSignal.any.bind(AbortSignal)

  // Record every composite signal that's created while the server is running,
  // so that the route handler can inspect their abort listeners.
  AbortSignal.any = function any(signals: AbortSignal[]) {
    const compositeSignal = originalAny(signals)
    compositeSignals.push(compositeSignal)

    return compositeSignal
  }
}

export function getCompositeSignalStats(): CompositeSignalStats {
  const compositeSignals = globalThis.__compositeSignals ?? []

  return {
    created: compositeSignals.length,
    withAbortListeners: compositeSignals.filter(
      (compositeSignal) =>
        getEventListeners(compositeSignal, 'abort').length > 0
    ).length,
  }
}
