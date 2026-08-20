export async function register() {
  console.log('[INSTRUMENTATION] NEXT_RUNTIME =', process.env.NEXT_RUNTIME)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { readdir } = await import('node:fs/promises')
    const dir = process.cwd() + '/models'
    const files = await readdir(dir)
    for (const f of files) {
      const p = dir + '/' + f
      console.log('[INSTRUMENTATION] importing', p)
      await import(p)
      console.log('[INSTRUMENTATION] import ok', p)
    }
  }
}
