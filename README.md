# Repro: un-skipping `should not re-fetch cached data when navigating back to a route group`

Upstream test: `test/e2e/app-dir/app-prefetch/prefetching.stale-times.test.ts`
(marked `it.skip` with `// FIXME: Flaky test - investigate and re-enable`).

Verified against vercel/next.js canary @ 14a69ef78b94c9bdb68b2f1d5d1a55599ff8022c

## Steps

```bash
git clone --depth 1 -b canary https://github.com/vercel/next.js
cd next.js
pnpm install && pnpm build
git apply /path/to/unskip-route-group-test.patch
# the suite early-returns in dev mode, so run production (start) mode:
pnpm test-start test/e2e/app-dir/app-prefetch/prefetching.stale-times.test.ts -t "navigating back to a route group"
pnpm test-start-turbo test/e2e/app-dir/app-prefetch/prefetching.stale-times.test.ts -t "navigating back to a route group"
```

## Result

Passed 5/5 (webpack) and 3/3 (turbopack) on that commit; ~4.6-5.1s per run.
The flake was not reproduced locally.
