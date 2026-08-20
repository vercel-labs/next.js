export async function register() {
  const parse = (await import('./parser')).default
  console.log('[instrumentation] parsed:', await parse())
}
