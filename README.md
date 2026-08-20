# Repro: vercel/next.js#68950 — `Cannot find module '.next/server/vendor-chunks/lib/worker.js'`

Minimal reproduction of a `pino` logger that uses a worker-thread transport
(`thread-stream`) inside an App Router server component compiled by webpack.

## Run

```bash
npm install
npm run dev
# in another shell
curl http://localhost:3000/
```

## Observed (next 15.5.7, webpack `next dev`)

```
Error: Cannot find module '<project>/.next/server/vendor-chunks/lib/worker.js'
  code: 'MODULE_NOT_FOUND'
⨯ uncaughtException: Error: the worker thread exited
    at Worker.onWorkerExit (webpack-internal:///(rsc)/./node_modules/thread-stream/index.js)
```

No log line is emitted; the dev server logs an uncaught exception. Webpack bundles
`thread-stream` into a vendor chunk, so its `require.resolve`-based worker path
(`lib/worker.js`) no longer exists on disk next to the emitted chunk.

## Expected

`[..] INFO: hello from server component` is printed, as it is when the transport
is removed or when `pino` is listed in `serverExternalPackages`.

## Version matrix (verified, Node 24, Linux)

| next | bundler | result |
| --- | --- | --- |
| 14.1.3 (reported) | webpack | MODULE_NOT_FOUND + worker thread exited |
| 14.2.32 | webpack | MODULE_NOT_FOUND |
| 15.5.7 | webpack | MODULE_NOT_FOUND |
| 16.0.0 | webpack (`next dev --webpack`) | MODULE_NOT_FOUND (`.next/dev/server/vendor-chunks/lib/worker.js`) |
| 16.3.1 / canary | webpack | works |
| 16.x | turbopack | works |
| 15.5.7 + `serverExternalPackages: ['pino','pino-pretty','thread-stream']` | webpack | works |
