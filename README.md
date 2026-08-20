# Repro: server stack traces don't match TypeScript source (vercel/next.js#58883)

Minimal reproduction of https://github.com/vercel/next.js/issues/58883 on Next.js canary.

`new Error()` is created on **line 4** of both `src/app/test-app/route.ts` and
`src/pages/api/test-pages.ts`, but the logged server stack trace does not point there.

## Run

```bash
npm install
npm run dev            # Turbopack (default)
# or: npx next dev --webpack
curl localhost:3000/api/test-pages
curl localhost:3000/test-app
```

Then read the stack trace printed by the dev server.

## Observed on next@16.3.1-canary.25 (Node 24)

Turbopack dev:
```
Error:
    at handler (/path/.next/dev/server/chunks/[root-of-the-server]__15kfdfk._.js:22:17)
    at GET (/path/.next/dev/server/chunks/[root-of-the-server]__08p9gu8._.js:61:17)
```

Webpack dev (`next dev --webpack`):
```
Error:
    at handler (webpack-internal:///(api-node)/./src/pages/api/test-pages.ts:6:17)
    at GET (webpack-internal:///(rsc)/./src/app/test-app/route.ts:8:17)
```

Expected: `src/app/test-app/route.ts:4:17` and `src/pages/api/test-pages.ts:4:17`.

`NODE_OPTIONS='--enable-source-maps' next dev` (workaround reported in the issue thread)
does **not** change the output on canary — the trace still points at the Turbopack chunk.
`.js.map` files do exist next to the emitted chunks in `.next/dev/server/chunks/`.
