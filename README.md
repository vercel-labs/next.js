# Repro: vercel/next.js#79496

Passing a parallel-route slot (`ReactNode` prop of the layout) into a client
React context and rendering it from a client component crashes.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/blog
```

## Observed

- next@15.3.2: 500 — `TypeError: Cannot read properties of undefined (reading '0')`
  at `OuterLayoutRouter` (`layout-router.tsx:534`, `const treeSegment = tree[0]`).
- next@16.4.0-canary.0 (Turbopack): no error, but `GET /blog` never finishes (hangs > 120s).
- Rendering `{breadcrumbs}` directly in the layout (no context) works fine.
