// Verbatim copy of examples/with-msw/mocks/index.ts (canary):
// `initMocks()` is never awaited and uses async `import()`, so the worker
// is not ready when the app's first client-side requests happen.
async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server')
    server.listen()
  } else {
    const { worker } = await import('./browser')
    worker.start()
  }
}

initMocks()

export {}
