# Reproduction for vercel/next.js#67063

Server-side `new Worker(new URL('./worker.ts', import.meta.url))` (node `worker_threads`)
resolves to a wrong path under webpack: `/_next/<chunk>.js` instead of `.next/server/...`.

## Steps

```bash
npm install
npm run dev -- --webpack   # or: npx next dev --webpack
curl http://localhost:3000/
```

Dev server logs:

```
⨯ uncaughtException: Error: Cannot find module '/_next/_rsc_app_lib_create-invoice_ts.js'
  code: 'MODULE_NOT_FOUND'
```

`npx next build --webpack` fails the same way during static generation:
`Error: Cannot find module '/_next/518.js'` while the chunk actually exists at
`.next/server/chunks/518.js`.

Turbopack (`npx next dev`, the Next.js 16 default) does not emit the error.

Verified with next@16.3.1-canary.25 on Node 24.
