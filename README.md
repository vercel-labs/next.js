# Repro attempt: issue #97919 — deployment-id skew on a prefetched-shell navigation

Attempts to reproduce "segment cache silently discards deployment-mismatched dynamic
responses — navigation wedges on the prefetched shell instead of MPA fallback"
(vercel/next.js#97919) locally, on `next@16.4.0-canary.8` (also verified on `16.3.0`).

Setup mirrors the report: App Router, `cacheComponents: true`,
`experimental.staleTimes.static = 1800`, `deploymentId` configured (so the server sends
`x-nextjs-deployment-id` on RSC responses), Turbopack production build, `next start`.

`scripts/proxy.mjs` sits in front of `next start` and, after `GET /__flip`, rewrites
`x-nextjs-deployment-id` to `deployment-NEW` on **dynamic navigation RSC responses only**
(`rsc: 1`, no prefetch header) — i.e. the mismatch is discovered exclusively on the
dynamic fill of a navigation whose static shell already came from the prefetch cache,
which is the scenario in the issue. `SKEW_MODE=all` rewrites every RSC response
(a full "new deployment is live") and behaves identically.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npx next start -p 3000 &          # OLD deployment
node scripts/proxy.mjs &          # skew proxy on :3100
node scripts/run-repro.mjs        # Playwright: prefetch -> flip -> click -> observe 16s
```

Variant where the mismatch lands on a dynamic (`prefetch={true}`) prefetch that spawned
the navigation's segment entries: `node scripts/run-repro-fullprefetch.mjs`.

## Observed result (not the reported wedge)

```
[proxy] GET /records?_rsc=... rsc=true prefetch=false -> 200 depId=deployment-NEW (REWRITTEN)
full document (MPA) navigation to /records fired 69ms after the click
pathname=/records  hasShell=true  hasSkeleton=false  hasDynamic=true
RESULT: navigation completed (bug NOT reproduced)
```

The mismatched dynamic fill triggers a full document navigation almost immediately; the
tab never wedges on the skeleton. Same outcome with `SKEW_MODE=all` and with the
`prefetch={true}` variant, on 16.3.0 and 16.4.0-canary.8.

Why: the navigation's dynamic fill goes through `fetchMissingDynamicData` ->
`fetchServerResponse`, which compares `x-nextjs-deployment-id` itself and returns
`doMpaNavigation(res.url)`, so `ppr-navigations` takes the hard-navigation exit. The
`writeDynamicRenderResponseIntoCache` branch cited in the issue is only reached with
`spawnedEntries !== null` from `fetchSegmentPrefetchesUsingDynamicRequest`, i.e. the
prefetch scheduler — not the navigation path.
