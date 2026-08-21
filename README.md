# Reproduction: `⚠ Server is approaching the used memory threshold, restarting...` (vercel/next.js#83275)

The original report has no reproduction ("large codebase, dev mode, several code
changes over time"). This is a self-contained, scripted version of that
scenario: a synthetically large App Router codebase, `next dev`, and a crawl of
the routes while sampling the *exact* heap numbers Next.js uses to decide
whether to restart the dev server
(`packages/next/src/server/lib/utils.ts` → `getMemoryRestartStats`:
`used_heap_size > 0.8 * heap_size_limit`).

## Run

```bash
npm install
npm run generate                 # 250 routes x 25 components = 6500 modules

# terminal 1 (webpack dev server, default Node heap)
npm run dev:webpack 2>&1 | tee dev.log

# terminal 2
npm run crawl                    # visits /gen/route-0 ... /gen/route-249
```

Turbopack variant: `npm run dev` in terminal 1 instead.

Both scripts print `used=<MB> (<pct>% of <limit>MB limit) rss=<MB>` samples from
`/api/heap`, which calls `v8.getHeapStatistics()` inside the dev server process.

## Observed (Next.js 16.3.1, Node 24.17.0, Linux, 4 GB RAM, heap limit 2333 MB → threshold 1866 MB)

### `next dev --webpack`

Used heap climbs monotonically with each newly compiled route and never comes
back down; after ~45 route compiles it crosses the 80 % threshold and the dev
server restarts, then does it again ~60 routes later:

```
baseline (after gc)  used=  70.4MB ( 3.0%) rss= 268MB
pass 1 route 0   200  used= 268.0MB (38.1%) rss= 761MB
pass 1 route 20  200  used= 450.0MB (63.9%) rss= 858MB
pass 1 route 40  200  used=1773.8MB (76.0%) rss=2619MB
pass 1 route 44       request failed (dev server restarted)
pass 1 route 50  200  used= 629.9MB (27.0%) rss=1128MB   <-- fresh process
...
pass 1 route 103      request failed (dev server restarted)
```

dev.log:

```
⚠ Server is approaching the used memory threshold, restarting...
✓ Ready in 279ms
...
⚠ Server is approaching the used memory threshold, restarting...
✓ Ready in 280ms
```

In-flight requests during the restart fail (`fetch failed` / `terminated`).

### `next dev` (Turbopack) — different failure mode

JS heap stays low (~680 MB, 29 % of the limit) so the restart heuristic never
fires, but RSS grows to ~3.5 GB of native memory over ~130 route compiles and
the process is hard-killed by the OS OOM killer instead of restarting
gracefully:

```
pass 1 route 100 200 used=534.6MB (22.9%) rss=2443MB
pass 1 route 120 200 used=682.2MB (29.2%) rss=3473MB
pass 1 route 130     request failed (fetch failed)   # kernel: Out of memory: Killed process next-server, anon-rss:3985988kB
```

## Notes

* Setting `NODE_OPTIONS=--max-old-space-size=512` makes the app OOM-crash
  *before* the warning: `heap_size_limit` becomes 704 MB, so the 80 % threshold
  (563 MB) sits above the real old-space limit and the restart heuristic never
  fires. Run with the default heap to see the warning.
* `/api/heap?gc=1` forces `global.gc()` (the dev scripts pass `--expose-gc`) to
  show the growth is retained, not garbage waiting to be collected.

## Files

* `gen-app.mjs` – generates `app/gen/route-*/` (gitignored)
* `crawl.mjs` – route crawler + heap sampler
* `load.mjs` – single-route request flood (heap stays flat: ~78 MB → 132 MB after 4000 requests)
* `edit-loop.mjs` – repeated file edits / HMR recompiles (webpack: 236 MB → 252 MB retained after 80 edits)
* `app/api/heap/route.js` – reports `v8.getHeapStatistics()` from the dev server process
