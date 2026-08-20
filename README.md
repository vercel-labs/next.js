# Repro harness for vercel/next.js#38273 — "middleware slows down routing in production"

Minimal App Router app + latency benchmark, toggled by the presence of `middleware.js`
(the exact middleware from the issue: lowercase-redirect, no `matcher`).

## Run

```bash
npm install                # next@canary
# with middleware
npm run build && npm start &
npm run bench -- http://localhost:3000/ 100
node bench2.mjs http://localhost:3000/ 600 20
# without middleware
mv middleware.js middleware.js.bak
npm run build && npm start &
npm run bench -- http://localhost:3000/ 100
node bench2.mjs http://localhost:3000/ 600 20
# dev mode: npm run dev, then the same bench commands
```

`bench.mjs` = sequential latency (avg/p50/p90). `bench2.mjs` = throughput at concurrency 20.

## Measured on next@16.3.1-canary.25, Node 24, Linux (warm server)

| scenario | route | p50 latency | rps (c=20) |
| --- | --- | --- | --- |
| prod, middleware | `/` | 3.1 ms | 479 |
| prod, no middleware | `/` | 3.05 ms | 486 |
| prod, middleware | `/api/ping` | 2.98 ms | 580 |
| prod, no middleware | `/api/ping` | 2.37 ms | 594 |
| dev, middleware | `/` | 21.4 ms | — |
| dev, no middleware | `/` | 18.1 ms | — |
| dev, middleware | `/api/ping` | 5.8 ms | — |
| dev, no middleware | `/api/ping` | 4.1 ms | — |

Production shows no measurable slowdown (<1 ms, within noise / ~1% rps). Dev adds ~2–3 ms
per request, far below the 80 ms → 250 ms regression reported in the issue.
