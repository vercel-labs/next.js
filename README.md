# Repro: next.js#77715 — instrumentation.ts node-only worker deps compiled for the edge instrumentation bundle

Reporter's linked repo (https://github.com/magicsong/me) is 404, so this is a minimal
reproduction using `pino`/`thread-stream` (the same worker-spawning dependency chain that
`@lmnr-ai/lmnr` pulls in).

`instrumentation.ts` guards the import with `process.env.NEXT_RUNTIME === 'nodejs'`, yet
Next.js still resolves the module from the `[instrumentation-edge]` bundle, so
`thread-stream`'s worker path is rewritten to a bundler module id.

## Run

```bash
npm install --legacy-peer-deps
npx next dev --turbopack
# then: curl http://localhost:3000/
```

## Observed (next 15.2.3, Turbopack)

```
TypeError: The worker script or module filename must be an absolute path or a relative path
starting with './' or '../'. Received "[project]/node_modules/thread-stream/index.js
[instrumentation-edge] (ecmascript)/lib/worker.js" { code: 'ERR_WORKER_PATH' }
```

## Matrix

| version | bundler | result |
| --- | --- | --- |
| 15.2.3 | Turbopack | `ERR_WORKER_PATH` with `[instrumentation-edge]` module id (reported error) |
| 15.2.3 | webpack | `Cannot find module '.next/server/vendor-chunks/lib/worker.js'` + `the worker thread exited` |
| 15.5.23 | Turbopack | `Cannot find module '/ROOT/node_modules/thread-stream/lib/worker.js'` |
| 16.3.1-canary.26 | Turbopack | works, logs `instrumentation registered` |
