export function register() {
  // @ts-ignore
  const runtime = typeof EdgeRuntime === 'string' ? 'edge' : 'nodejs'
  console.log(
    `[instrumentation] register() called in ${runtime} runtime (NEXT_RUNTIME=${process.env.NEXT_RUNTIME})`
  )
}
