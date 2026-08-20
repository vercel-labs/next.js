// Native module imported at the top level of instrumentation.js (issue #64879).
// Next.js bundles this into a cached `require("http")` module before register() runs.
import * as http from 'http'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[repro] http module cached by bundler before register():', typeof http.get)
    await import('./instrumentation-node.js')
  }
}
