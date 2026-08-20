# Repro: `new Worker(url)` with a hoisted `new URL(..., import.meta.url)` serves the worker as `video/mp2t` (webpack)

Issue: https://github.com/vercel/next.js/issues/31009

Next.js 16.3.1, webpack bundler (`--webpack`).

## Run

```bash
npm install
npm run dev        # next dev --webpack (port 3000)
# or: npm run build && npm run start
```

Open http://localhost:3000 and check the browser console.

## Expected

Both workers start and reply `pong`.

## Actual (webpack dev and `next build`/`next start`)

* `const url = new URL('../workers/worker.ts', import.meta.url); new Worker(url)`
  -> `Refused to execute script from '/_next/static/media/worker.<hash>.ts' because its MIME type ('video/mp2t') is not executable.`
  The raw `.ts` source is emitted to `/_next/static/media/` and served with `Content-Type: video/mp2t`.
* `new Worker(new URL('../workers/worker.ts', import.meta.url))` (single expression) works.

Turbopack (`npm run dev:turbo`) handles both forms correctly.
