# Repro: Docker + cacheComponents + `headers()` -> 500 `DYNAMIC_SERVER_USAGE`

Minimal reproduction of https://github.com/vercel/next.js/issues/96806
(next@16.3.1-canary.4).

`app/page.tsx` calls `await headers()` inside a `<Suspense>` boundary and
`next.config.ts` sets `cacheComponents: true`. `next build` emits a Partial
Prerender route (`◐ /`). It renders fine locally with `next start`.

## Run with Docker (reporter's setup)

```
docker compose up --build
# production -> http://localhost:3000  => 500, DYNAMIC_SERVER_USAGE
# dev        -> http://localhost:3001  => OK
```

## Run without Docker (same failure)

```
npm run repro
```

Case A (runner **without** `next.config.ts`, exactly what the Dockerfile
runner stage copies) -> HTTP 500 and:

```
⨯ [Error: An error occurred in the Server Components render...] {
  digest: 'DYNAMIC_SERVER_USAGE'
}
```

Case B (same `.next`, `next.config.ts` present) -> HTTP 200, no error.

## Analysis

The runner stage copies only `public`, `.next`, `node_modules` and
`package.json`; `next.config.ts` is missing at runtime, so `cacheComponents`
is off in the server while `.next` was built with it on. The PPR/dynamic
resume path then treats `headers()` as illegal dynamic usage and throws
`DYNAMIC_SERVER_USAGE` instead of streaming the dynamic hole.
Next.js does not warn that the runtime config disagrees with the build
output.
