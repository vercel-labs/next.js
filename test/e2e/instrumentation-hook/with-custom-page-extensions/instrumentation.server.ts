export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    ;(globalThis as any).instrumentationFinished = 'nodejs'
  }
}
