export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && !process.env.DISABLE_SENTRY) {
    await import('./sentry.server.config')
    console.log('[repro] Sentry server SDK initialized')
  }
}
