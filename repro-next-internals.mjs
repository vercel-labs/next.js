// Reproduction: Next.js 16.3.0's real abort path (dynamic-rendering.js) leaves the
// abort-reason Error's V8 structured stack frames un-materialized, so AbortSignal.reason
// pins the calling render frame's Context -> the render's working set.
//
// Run: node --expose-gc repro-next-internals.mjs
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const dr = require('next/dist/server/app-render/dynamic-rendering.js')
const nextVersion = require('next/package.json').version

const MB = 1024 * 1024
const PAYLOAD = 8 * MB
const N = 20
const gc = () => { global.gc(); global.gc() }
const abMB = () => Math.round(process.memoryUsage().arrayBuffers / MB)

// Mirrors the cached page value shape produced by app-render and handed to the
// cache/response ({ html, kind, postponed, rscData, segmentData, status }).
function makeRenderWorkingSet() {
  return {
    kind: 'APP_PAGE',
    status: 200,
    html: null,
    postponed: undefined,
    rscData: null,
    segmentData: new Map([['/_full', Buffer.allocUnsafe(PAYLOAD)]]),
  }
}

// One "render": the working set lives in this frame's Context, and Next's real
// abort helper is invoked from that frame (as it is from a server component).
function runRender(mode) {
  const pageValue = makeRenderWorkingSet()
  const controller = new AbortController()
  const prerenderStore = {
    type: 'prerender',
    controller,
    dynamicTracking: null,
    runtimeStagePromise: null,
    hasReadableErrors: false,
  }

  const renderFrame = () => {
    void pageValue.segmentData.size // pageValue is in this frame's context
    const prev = Error.stackTraceLimit
    if (mode === 'limit0') Error.stackTraceLimit = 0
    try {
      // REAL Next.js code path: aborts prerenderStore.controller with
      // createPrerenderInterruptedError(...) as the reason, then throws.
      dr.abortOnSynchronousPlatformIOAccess('/x', 'cookies', new Error('stack'), prerenderStore)
    } catch {}
    if (mode === 'limit0') Error.stackTraceLimit = prev
    if (mode === 'materialize') void controller.signal.reason.stack
    if (mode === 'delete-stack') delete controller.signal.reason.stack
    if (mode === 'set-stack') {
      const r = controller.signal.reason
      r.stack = `${r.name}: ${r.message}` // proposed fix: stack setter clears the private slot
    }
    if (mode === 'defineProperty') Object.defineProperty(controller.signal.reason, 'stack', { value: '' })
  }
  renderFrame()
  return controller.signal // only the signal survives the request
}

function measure(mode) {
  gc()
  const before = abMB()
  const kept = []
  for (let i = 0; i < N; i++) kept.push(runRender(mode))
  gc()
  const held = abMB()
  kept.length = 0
  gc()
  const after = abMB()
  return { mode, retained: held - before, afterDrop: after - before }
}

console.log(`next ${nextVersion}, node ${process.version}`)
console.log(`payload per render: ${PAYLOAD / MB} MB x ${N} renders = ${(N * PAYLOAD) / MB} MB`)
{
  const s = runRender('baseline')
  console.log(`abort reason: instanceof Error=${s.reason instanceof Error} digest=${s.reason.digest} name=${s.reason.name}\n`)
}
for (const mode of ['baseline', 'delete-stack', 'defineProperty', 'set-stack', 'materialize', 'limit0']) {
  const r = measure(mode)
  const expected = (N * PAYLOAD) / MB
  console.log(
    `${mode.padEnd(15)} retained while signals alive: ${String(r.retained).padStart(4)} MB of ${expected} MB` +
      ` -> ${r.retained > expected * 0.5 ? 'PINNED' : 'released'}; after dropping signals: ${r.afterDrop} MB`
  )
}
// stackTraceLimit is binary, not proportional
for (const lim of [10, 3, 1, 0]) {
  const prev = Error.stackTraceLimit
  Error.stackTraceLimit = lim
  const r = measure('baseline')
  Error.stackTraceLimit = prev
  console.log(`stackTraceLimit=${String(lim).padEnd(2)} retained: ${r.retained} MB of ${(N * PAYLOAD) / MB} MB`)
}

// bare abort() (the ~18 other abort sites in app-render.js) for comparison
function bare() {
  const pageValue = makeRenderWorkingSet()
  const c = new AbortController()
  const f = () => { void pageValue.segmentData.size; c.abort() }
  f()
  return c.signal
}
gc(); const b0 = abMB(); const keep = []; for (let i = 0; i < N; i++) keep.push(bare()); gc()
console.log(`\nbare abort() (DOMException reason) retained: ${abMB() - b0} MB of ${(N * PAYLOAD) / MB} MB`)
keep.length = 0
