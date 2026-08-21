export async function register() {
  console.log('INSTRUMENTATION REGISTERED', process.env.NEXT_RUNTIME)
  globalThis._instrumentation_registered = true
}
