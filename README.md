# Repro: `next build` OOM in "Collecting build traces" (vercel/next.js#76704)

`outputFileTracingIncludes` globs are expanded once per matching route with
`Promise.all`, and every route keeps its own copy of the matched file list, so
heap usage scales with `routes x matched files`. With 120 dynamic routes and a
20,000-file include glob the webpack build dies right after page generation:

```
   Collecting build traces ...
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

## Run

```bash
npm install
NODE_OPTIONS=--max-old-space-size=2048 npm run build
```

`npm run build` first runs `generate.mjs`, which creates the 120 routes and the
20k traced files (nothing large is committed).

## Observed

| version | bundler | result (heap limit 2048 MB) |
| --- | --- | --- |
| next 15.1.7 | webpack | OOM in "Collecting build traces" |
| next 16.3.1-canary.26 (`next build --webpack`) | webpack | OOM in "Collecting build traces" |
| next 16.3.1-canary.26 (default) | turbopack | builds fine (even with 1024 MB) |

Control: deleting `outputFileTracingIncludes` from `next.config.js` makes the
same app build fine with a 2048 MB heap.
