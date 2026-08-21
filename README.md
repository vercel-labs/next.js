# Repro harness for vercel/next.js#86383 — "Next.js 16 increases TBT"

The issue links to the `next-learn` dashboard starter, not to a failing repro. This harness
builds one identical app on three configurations and measures Total Blocking Time (long-task
based, Lighthouse definition, 4x CPU throttling, median of 3 loads) plus the uncompressed
JS payload and the number of script requests:

* `v15`    — next@15.5.7
* `v16off` — next@16.0.3
* `v16on`  — next@16.0.3 with `cacheComponents: true`

## Run

```bash
bash run.sh          # static page with 50 <Link>s
bash run.sh /heavy   # 300 hydrated client components
```

`measure.js` can also be pointed at any running server:
`THROTTLE=4 node measure.js name=http://localhost:3000/`.

## Measured result (Linux, Node 24, Chromium 141, 4x CPU throttle, median of 3)

| variant | route | TBT | JS (KB, uncompressed) | script requests |
|---|---|---|---|---|
| next 15.5.7            | /      | 86 ms | 349.1 | 5 |
| next 16.0.3            | /      | 75 ms | 440.9 | 8 |
| next 16.0.3 + cacheComponents | /      | 75 ms | 441.0 | 8 |
| next 15.5.7            | /heavy | 87 ms | 341.0 | 5 |
| next 16.0.3            | /heavy | 64 ms | 432.3 | 8 |
| next 16.0.3 + cacheComponents | /heavy | 81 ms | 432.4 | 8 |

No TBT regression is reproducible from `cacheComponents` on these pages; the only consistent
Next.js 15 -> 16 delta is ~+92 KB of uncompressed first-load JS split over 3 extra script
requests. `cacheComponents: true` does not change the client payload at all.

The same measurement run against the app the issue links to
(`vercel/next-learn` `dashboard/starter-example`, fonts file added, `next@16.0.3` +
`cacheComponents: true`) gave TBT 78 ms (next 15.5.7) vs 71 ms (next 16.0.3 + cacheComponents).
