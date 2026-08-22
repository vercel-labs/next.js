# Repro: next.js#79496 — passing a parallel-route slot through React context crashes

Minimal reproduction of https://github.com/vercel/next.js/issues/79496

The root layout receives the `@breadcrumbs` slot and puts the `ReactNode` into a client
Context Provider. A deeper client component (`components/content.js`, rendered from
`app/blog/page.js`) reads it with `use()` and renders it.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/blog
```

## Observed

next 15.3.2 (webpack dev): HTTP 500 + overlay

```
TypeError: Cannot read properties of undefined (reading '0')
    at OuterLayoutRouter (../../src/client/components/layout-router.tsx:534:27)
  533 |   const tree = parentTree[1][parallelRouterKey]
> 534 |   const treeSegment = tree[0]
```

next 16.4.0-canary.1 (turbopack dev): `/blog` never responds — the request hangs
(no bytes streamed, server logs `GET /blog 200 in 2.0min (application-code: 120s)`),
while `/` (which does not read the slot from context) renders fine.

## Expected

The breadcrumbs slot renders where the context consumer renders it.
