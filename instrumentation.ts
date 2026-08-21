export async function register() {
  console.log('[instrumentation] register in runtime:', process.env.NEXT_RUNTIME)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
