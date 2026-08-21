# Repro: @next/mdx + rehype-katex slow `next dev` compile (issue #91103)

Claim under test: the Turbopack rule's `as: '*.tsx'` in `packages/next-mdx/index.js`
double-processes already-compiled MDX output and costs ~50s; `as: '*.js'` fixes it.

## Run

```bash
npm install
node gen.mjs 50           # 50 KaTeX blocks -> 11.6 KB .mdx
npx next dev              # then request http://localhost:3000/heavy
```

`./run-timing.sh <label> <port> [--webpack]` starts dev, waits for `/`, then times two
requests to `/heavy` and logs the server output to
`/workspace/.next-maintainer/reproduction-artifacts/next-server/<label>.log`.

## Measured (next 16.3.1-canary.26, linux x64, 2 cores, 4 GB RAM)

| config | `/heavy` first request |
| --- | --- |
| 25 blocks, `as: '*.tsx'` (default) | 8.8 s |
| 25 blocks, `as: '*.js'` (patched) | 7.7 s |
| 50 blocks, `as: '*.tsx'`, `--max-old-space-size=3300` | 14.4 s |
| 50 blocks, `as: '*.js'`, `--max-old-space-size=3300` | 15.5 s |
| 50 blocks, default heap, `as: '*.tsx'` | OOM crash after ~16 s |
| 50 blocks, default heap, `as: '*.js'` | OOM crash after ~16 s |
| 50 blocks, default heap, `next dev --webpack` | OOM crash after ~22 s |

`node standalone.mjs` shows `@mdx-js/mdx` + rehype-katex compiles the 11.6 KB source in
~0.46 s into 2,029,635 bytes of JS, i.e. the loader itself is fast and the cost is in
bundling/serving ~2 MB of generated `_jsx()` code.

Conclusion: slow dev compilation (and a default-heap OOM) reproduces, but it is unrelated
to `as`; switching to `as: '*.js'` did not help and it is not Turbopack-specific.
