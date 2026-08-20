# Repro: issue #47483 — `app/index/page.tsx` route

Next.js canary (16.3.1-canary.25), Node 24.

## Run

```
npm install
npm run dev -- --webpack   # or: npx next build --webpack
```

Visit http://localhost:3000/index

## Observed (webpack)

- dev: HTTP 500 — `InvariantError: Invariant: The client reference manifest for route "/index" does not exist. This is a bug in Next.js.`
- `next build --webpack`: build fails prerendering `/index` with the same invariant.

## Observed (Turbopack, default)

`/index` renders fine and `next build` succeeds, so the original hang reported in #47483
no longer reproduces with the default bundler.
