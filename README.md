# Repro: bundled `@babel/runtime` in published `next` tarballs (issue #81111)

The issue links only to a GitHub code-search URL, so this is a minimal runnable
reproduction. It downloads published `next` tarballs, reads
`dist/compiled/@babel/runtime/package.json`, and benchmarks the
GHSA-968p-4wvh-cqc8 `wrapRegExp` ReDoS path from each bundled copy.

## Run

```bash
node check-bundled-babel-runtime.mjs
# or specific versions
node check-bundled-babel-runtime.mjs 15.3.1 15.4.0
```

## Observed (Node 24.17.0)

| next | @babel/runtime | wrapRegExp ReDoS (ms) |
| --- | --- | --- |
| 15.3.1 | 7.22.5 | ~644 |
| 15.4.0 | 7.27.0 | ~4 |
| 15.5.23 | 7.27.0 | ~4 |
| 16.3.0 | 7.27.0 | ~4 |
| 14.2.35 | 7.22.5 | ~644 |
| canary (16.4.0-canary.0) | 7.27.0 | ~4 |

Fixed by vercel/next.js#78673 (canary 2025-04-30), first stable in 15.4.0.
14.x still ships 7.22.5; the 14.x backport (#81120) was closed unmerged.
