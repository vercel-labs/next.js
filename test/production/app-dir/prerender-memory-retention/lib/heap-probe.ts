import { SAMPLE_EVERY } from './config'

let prerenders = 0

/**
 * Logs the retained heap of the static generation worker after every
 * `SAMPLE_EVERY`-th prerender. The build is started with `--expose-gc`, so the
 * samples are taken after a full garbage collection and therefore only include
 * memory that the worker still holds on to.
 */
export function recordHeapSample(): void {
  prerenders++

  if (prerenders % SAMPLE_EVERY !== 0) {
    return
  }

  const gc = (globalThis as any).gc as undefined | (() => void)

  if (typeof gc === 'function') {
    // Collect twice so that objects that only became unreachable during the
    // first collection are collected as well.
    gc()
    gc()
  }

  const heapUsedMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

  console.log(
    `[heap] prerenders=${prerenders} heapUsedMB=${heapUsedMB} gc=${typeof gc === 'function'}`
  )
}
