# Repro: nested `unstable_cache` — inner (L2) entry is recomputed whenever outer (L1) entry expires

Issue: https://github.com/vercel/next.js/issues/77412

Minimal version of https://github.com/markomitranic/nextjs-nested-cache-reproduction,
with short TTLs so the bug is observable in ~15 seconds, plus a `"use cache"` control case.

## Layout

- `lib/repository.ts` — `unstable_cache` L1 (`revalidate: 5`) that calls `unstable_cache` L2 (`revalidate: 3600`)
- `lib/use-cache.ts` — same nesting with `"use cache"` + `cacheLife({revalidate: 5})` / `cacheLife({revalidate: 3600})`
- Routes: `/api/nested-unstable-cache`, `/api/nested-use-cache` (both `force-dynamic`)

Each response returns `l2ReadAt` (timestamp of the inner cached work) plus counters
of how many times each cached function actually ran in this process.

## Run

```bash
npm install
npm run build
npm run start
# poll every ~8s, i.e. after each 5s L1 revalidate window
for i in 1 2 3 4 5; do
  curl -s localhost:3000/api/nested-unstable-cache; echo
  curl -s localhost:3000/api/nested-use-cache; echo
  sleep 8
done
```

## Observed (next@16.3.1-canary.26, also 15.3.0-canary.18, production `next start`)

`unstable_cache`: every L1 expiry also recomputes L2 — `l2Calls` grows in lockstep
with `l1Calls` and `l2ReadAt` changes, even though L2's `revalidate` is 3600.

```
{"car":{"id":1,"l2ReadAt":"00:35:33.603","l1ReadAt":"00:35:33.604"},"l1Calls":1,"l2Calls":1}
{"car":{"id":1,"l2ReadAt":"00:35:48.961","l1ReadAt":"00:35:48.961"},"l1Calls":2,"l2Calls":2}
{"car":{"id":1,"l2ReadAt":"00:36:09.076","l1ReadAt":"00:36:09.076"},"l1Calls":4,"l2Calls":3}
{"car":{"id":1,"l2ReadAt":"00:36:25.122","l1ReadAt":"00:36:25.122"},"l1Calls":6,"l2Calls":5}
```

`"use cache"`: correct — L1 revalidates on its own 5s schedule while L2 stays cached.

```
{"car":{"id":1,"l2ReadAt":"00:35:33.633","l1ReadAt":"00:35:33.634"},"l1Calls":1,"l2Calls":1}
{"car":{"id":1,"l2ReadAt":"00:35:33.633","l1ReadAt":"00:36:09.086"},"l1Calls":3,"l2Calls":1}
{"car":{"id":1,"l2ReadAt":"00:35:33.633","l1ReadAt":"00:36:33.152"},"l1Calls":6,"l2Calls":1}
```

So the regression is scoped to the legacy `unstable_cache` data cache path, where the
outer cache miss appears to force-bypass (`no-cache`/miss) the inner cache lookup
instead of reading the still-fresh inner entry.
