# Repro harness: Turbopack `next build` whole-app module graph scaling (issue #98043)

Issue #98043 reports that on a 2,070-route App Router app (~31k modules, 166 cores)
`next build` spends ~60% of compile wall time in `next_api::project whole app module graph`
with only ~22 cores busy, and that the persistent build cache "inverts" after ~370 changed files.

This is a *parameterised* synthetic app to measure that phase. Scale the knobs up to
match the reporter's graph size and run it on a many-core machine.

## Usage

```bash
npm install
ROUTES=700 PERPAGE=12 SHARED=1200 npm run gen   # ~9.6k leaf + 1.2k shared modules
NEXT_TURBOPACK_TRACING=turbopack npx next build # trace -> .next-profiles/trace-turbopack.bin

# phase breakdown (root spans, then drill in with --parent <id>)
npx next internal trace .next-profiles/trace-turbopack.bin --port 5747 --mcp-port 5748 &
npx next internal query-trace --port 5748 --sort value
npx next internal query-trace --port 5748 --parent a1 --sort value

# system-wide cores-busy sampling while a build runs
./scripts/sample-cpu.sh > cpu.log &

# persistent-build-cache drift experiment (warm 0/1/200/800 changed files, then cold)
./scripts/cache-drift.sh
```

## Measurements taken on a 2-core / 4 GB Linux box, Next.js 16.3.3, Node 24

ROUTES=700 PERPAGE=12 SHARED=1200 (10,302 first-party TS files):

| run | compile |
| --- | --- |
| cold, cache written | 34.6s (total wall 46s) |
| warm, no change | 3.3s |
| warm, 1 changed file | 1.7s |
| warm, 200 changed files | 1.7s |
| warm, 800 changed files (~10% of leaves) | 2.2s |

* Cache dir grew only 302 MB -> 332 MB across the drift runs; no inversion (warm stayed ~15x faster than cold).
* Trace root spans: `write all entrypoints to disk` 38.3s corrected = `app endpoint HTML` 703 spans/28.1s +
  `emitting` 8.5s; **no `whole app module graph` span was emitted at this scale**, and CPU sampling showed
  1.9-2.0 of 2 cores busy for the whole compile, so the "concurrent but CPU-starved" symptom cannot be
  observed on a 2-core host. Re-run with ROUTES>=2000 on a >=64-core host to confirm the phase share.
