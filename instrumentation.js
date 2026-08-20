export function register() {
  globalThis.MY_SINGLETON = 'set-in-instrumentation-' + Math.random().toString(36).slice(2, 8)
  console.log('[instrumentation] register():' + ' set globalThis.MY_SINGLETON=', globalThis.MY_SINGLETON)
}
