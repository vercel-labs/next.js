// Community workaround suggested in vercel/next.js#51404
export function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  console.log('[instrumentation] register(), NEXT_MANUAL_SIG_HANDLE=' + process.env.NEXT_MANUAL_SIG_HANDLE)
  process.on('SIGTERM', async () => {
    console.log('[instrumentation] Received SIGTERM, draining for 3s...')
    await new Promise((r) => setTimeout(r, 3000))
    console.log('[instrumentation] drain finished after 3s')
  })
}
