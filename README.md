# Repro for vercel/next.js#96533 - ISR revalidation external/arrayBuffers growth

Based on the reporter's repro (https://github.com/udohsolomon/nextjs-isr-leak-repro),
with two fixes/additions:

- `next start` now binds port 3299 (the reporter's `drive.mjs` hardcodes 3299 but
  `npm start` used the default 3000).
- `instrumentation.ts` can force a full GC before each `[mem]` sample
  (`FORCE_GC=1` + `--expose-gc`) so retained vs. merely uncollected memory can be told apart.

## Run

```bash
npm install
npm run build

# A: default GC (reporter's scenario)
npm start > server.log 2>&1 &
node drive.mjs server.log 25

# B: same workload, full GC before every memory sample
npm run start:gc > server-gc.log 2>&1 &
node drive.mjs server-gc.log 15
```

## Observed (Next 16.2.12, Linux x64, 2 cores / 4 GB)

| run | arrayBuffers | rss |
|---|---|---|
| Node 22.22.3, default GC | sawtooth 30 -> 87 MB | 286 -> 334 MB |
| Node 24.17.0, default GC | sawtooth 20 -> 80 MB | 400 -> 452 MB (flat) |
| Node 22.22.3, forced full GC | flat 20 - 29 MB | 204 -> 244 MB |

Raw per-round output in `results/`.

With a full GC before each sample the external memory returns to ~20 MB
(= 200 routes x ~100 KB of ISR cache entries) every single round, i.e. the
revalidation buffers are collectable; on this machine the Node 22 vs Node 24
difference claimed in the issue was not clearly reproducible (both oscillate in
a similar band; Node 22 shows the RSS drift, Node 24 sits at a higher plateau).
