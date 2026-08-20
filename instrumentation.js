// Next.js 14 server instrumentation hook: runs ONCE per server process,
// there is no per-request hook for App Router page/layout renders.
export function register() {
  console.log('[instrumentation] register() called once, pid=' + process.pid)
}
