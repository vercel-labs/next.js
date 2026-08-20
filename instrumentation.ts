// Reproduction for https://github.com/vercel/next.js/issues/61728
//
// The `NEXT_RUNTIME` check is done through a helper in another module
// (see ./env.ts) instead of inlining `process.env.NEXT_RUNTIME` directly.
// Because the value is only inlined/DCE'd for literal
// `process.env.NEXT_RUNTIME` reads, the node-only module below is pulled into
// the *edge* instrumentation bundle.
import { getNextRuntime } from './env'

export async function register() {
  console.log('[instrumentation] direct  :', process.env.NEXT_RUNTIME)
  console.log('[instrumentation] indirect:', getNextRuntime())

  if (getNextRuntime() === 'nodejs') {
    await import('./utils/node-instrumentation')
  }
}

// Swapping the guard for the inlined form below makes the webpack build pass
// and keeps ./utils/node-instrumentation out of the edge bundle:
//
//   if (process.env.NEXT_RUNTIME === 'nodejs') { ... }
