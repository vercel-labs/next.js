export async function register() {
  const singleton = (await import('./lib/singleton')).default
  console.log(`[instrumentation] singleton.value=${singleton.value}`)
}
