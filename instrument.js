// Preload: optional abort-reason retention + abort counting, per issue #97434 claims.
if (process.env.STL0) Error.stackTraceLimit = 0
const retained = []
globalThis.__retainedReasons = retained
let aborts = 0
const orig = AbortController.prototype.abort
AbortController.prototype.abort = function (reason) {
  aborts++
  if (process.env.RETAIN) {
    // simulate ANY long-lived retention of the abort reason (error buffer, breadcrumbs, etc.)
    retained.push(reason)
    if (retained.length > Number(process.env.RETAIN)) retained.shift()
  }
  return orig.call(this, reason)
}
globalThis.__abortCount = () => aborts
setInterval(() => {
  const m = process.memoryUsage()
  console.log(`[instr] aborts=${aborts} retained=${retained.length} rss=${Math.round(m.rss/1048576)}MB arrayBuffers=${Math.round(m.arrayBuffers/1048576)}MB stackTraceLimit=${Error.stackTraceLimit}`)
}, 15000).unref()
if (process.env.LOGREASONS) {
  const seen = new Set()
  const o2 = AbortController.prototype.abort
  AbortController.prototype.abort = function (reason) {
    const key = reason && reason.message !== undefined ? `${reason.name}: ${reason.message}` : String(reason)
    if (!seen.has(key)) { seen.add(key); console.log('[reason]', key) }
    return o2.call(this, reason)
  }
}
