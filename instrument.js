// Tracks composite AbortSignals created via AbortSignal.any and reports how many
// remain alive after a forced GC, attributed by creation stack.
const refs = [] // {ref, tag, aborted:boolean getter}
const orig = AbortSignal.any.bind(AbortSignal)
AbortSignal.any = function (signals) {
  const s = orig(signals)
  const stack = new Error().stack.split('\n').slice(1, 6).join('|')
  let tag = 'other'
  if (stack.includes('validateAtDepthImpl')) tag = 'extraChunksSignal(validateAtDepthImpl)'
  else if (stack.includes('warmupClientModulesForStagedValidation')) tag = 'initialClientReactSignal'
  else if (stack.includes('validateStagedShell')) tag = 'clientReactSignal'
  else if (stack.includes('app-render')) tag = 'app-render:other'
  else tag = stack.split('|')[1] || 'other'
  refs.push({ ref: new WeakRef(s), tag })
  return s
}
function report() {
  if (global.gc) { global.gc(); global.gc() }
  const alive = new Map()
  let total = 0
  for (const r of refs) {
    const s = r.ref.deref()
    if (s) { total++; alive.set(r.tag, (alive.get(r.tag) || 0) + 1) }
  }
  const mem = process.memoryUsage()
  console.log(`[SIGNALS pid=${process.pid}] created=${refs.length} alive=${total} heapUsed=${(mem.heapUsed/1e6).toFixed(1)}MB ` +
    [...alive.entries()].map(([k, v]) => `${k}=${v}`).join(' '))
}
setInterval(report, 5000).unref?.()
process.on('SIGUSR2', report)
