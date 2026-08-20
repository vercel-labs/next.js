# Reproduction for vercel/next.js#31021 — output file tracing dominates `next build`

Small pages-router app (5 pages + 2 API routes, MUI / lodash / date-fns) used to quantify the
`next build` time spent in output file tracing (`collect-build-traces` / `node-file-trace-build`).

## Run

```bash
npm install
node measure.mjs --webpack   # webpack build (drop --webpack for the Turbopack build)
```

`measure.mjs` runs two cold builds (`.next` removed each time) and prints the wall time plus the
`collect-build-traces` span read from `.next/trace`. `next.config.js` sets
`outputFileTracing: false` when `NEXT_REPRO_TRACING=false`, which only has an effect on Next <= 14.

## Measurements (Linux container, Node 24)

| next | build | wall | next-build | collect-build-traces |
| --- | --- | --- | --- | --- |
| 16.3.1-canary.25 | webpack, default | 19.06s | 18.46s | 9.16s (50%) |
| 16.3.1-canary.25 | webpack, `outputFileTracing: false` | 18.56s | 17.96s | 8.71s (no effect, key rejected) |
| 16.3.1-canary.25 | turbopack (default) | 8.49s | 7.88s | n/a (Rust tracing, `.nft.json` still emitted) |
| 14.2.30 | webpack, default | 14.35s / 14.29s | 13.73s / 13.70s | — |
| 14.2.30 | webpack, `outputFileTracing: false` | 9.48s / 8.71s | 8.70s / 8.09s | — |

Notes:
- On Next 14 disabling tracing cuts the build ~40% (14.3s -> 8.7s), reproducing the workaround from
  the issue thread on Linux as well; Windows I/O only amplifies it.
- On current canary `outputFileTracing` is no longer part of the config schema
  (`⚠ Unrecognized key(s) in object: 'outputFileTracing'`), so the opt-out users rely on is gone.
