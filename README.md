# Bug: `@vercel/otel` fetch wrapper stripped after HMR in dev mode

## Summary

`propagateContextUrls` in `@vercel/otel` stops propagating trace context (`traceparent` / `tracestate` headers) to outgoing `fetch()` requests after any HMR event in `next dev`. Manual `propagation.inject()` continues to work, confirming OTel context is active — only the automatic fetch instrumentation is broken.

## Steps to reproduce

```bash
npm install
```

**Terminal 1** — start the downstream server (logs incoming headers):

```bash
npm run downstream
```

**Terminal 2** — start Next.js dev server:

```bash
npm run dev
```

1. Open http://localhost:3000 — the page shows whether `traceparent` was received downstream
2. Check Terminal 1 — you should see `✅ traceparent: 00-...` (works on cold start)
3. Edit `app/page.tsx` — change the comment on line 1 (e.g., `v1` → `v2`) to trigger HMR
4. Refresh http://localhost:3000
5. Check Terminal 1 — `❌ traceparent: MISSING`

### Expected

`traceparent` header should be present on every request, including after HMR.

### Actual

`traceparent` is present on the first request after `next dev` cold start, but disappears after any HMR event and never comes back until the dev server is restarted.

## Affected versions

| Version | Branch | Cold Start | After HMR | Bug Present? |
|---|---|---|---|---|
| Next.js 16.2.3 | `main` | traceparent present | traceparent MISSING | Yes |
| Next.js 16.1.7 | `test/next-16.1` | traceparent present | traceparent MISSING | Yes |
| Next.js 16.0.11 | `test/next-16.0` | traceparent present | traceparent MISSING | Yes |
| Next.js 15.5.15 | `test/next-15.5` | traceparent present | traceparent MISSING | Yes |

## Root cause

In `packages/next/src/server/lib/router-server.ts`, `originalFetch` is captured **before** `@vercel/otel` instruments `globalThis.fetch`:

```
Timeline:
1. router-server.ts:139    → originalFetch = globalThis.fetch  (raw fetch, saved in closure)
2. ensureInstrumentationRegistered() → registerOTel() → globalThis.fetch = otelWrapper
3. patchFetch()             → wraps otelWrapper with Next.js cache layer
   Call chain: user code → Next.js → OTel → real fetch  ✅
```

On every HMR event, `resetFetch()` is called by the hot reloader (`hot-reloader-turbopack.ts:643`):

```typescript
// router-server.ts:155-158
const resetFetch = () => {
  globalThis.fetch = originalFetch   // ← raw fetch from step 1, OTel wrapper gone!
  ;(globalThis as Record<symbol, unknown>)[NEXT_PATCH_SYMBOL] = false
}
```

Then `patchFetch()` re-wraps on the next request, but now it wraps the **raw** fetch:

```
After HMR:
4. resetFetch()             → globalThis.fetch = raw fetch (pre-OTel)
5. patchFetch()             → wraps raw fetch with Next.js cache layer
   Call chain: user code → Next.js → real fetch  ❌  (OTel wrapper lost)
```

## Relevant Next.js commits

Two Next.js commits matter here:

### 1. Regression introduced: `15aeb92efb`

**Date:** August 20, 2024
**Commit:** `15aeb92efb` — `misc: tweak fetch patch restoration timing during HMR to allow for userland fetch patching (#68193)`

What it changed:

- Added `originalFetch = globalThis.fetch` in `router-server.ts`
- Added `resetFetch()` in `router-server.ts` that restores `globalThis.fetch = originalFetch`
- Added HMR-time `resetFetch()` calls in the dev hot reloaders

Why it matters:

- This is the commit that introduced the bug mechanism
- `originalFetch` is captured too early, before `@vercel/otel` wraps fetch
- After any HMR event, `resetFetch()` restores the pre-OTel fetch and strips the OTel wrapper permanently until restart

### 2. Bug became easier to hit in App Router dev: `0f867bb219`

**Date:** March 16, 2026
**Commit:** `0f867bb219` — `Turbopack: Enable server HMR by default for app pages (#91476)`

What it changed:

- Enabled `serverFastRefresh` by default for Turbopack app pages
- Replaced the old opt-in server HMR path with default-on behavior for that configuration

Why it matters:

- This did **not** introduce the underlying bug
- It made the bug much easier to reproduce for App Router + Turbopack users because the `resetFetch()` path now runs by default
- The underlying regression already existed before this commit

So the timeline is:

- Before `15aeb92efb`: this specific fetch-reset regression did not exist
- After `15aeb92efb`: bug exists in dev HMR paths
- After `0f867bb219`: App Router Turbopack users hit it more often because server HMR became default

## Suggested fix

`resetFetch()` should restore to the fetch as it was **after** instrumentation, not before. Either:

- Re-capture `originalFetch` after `ensureInstrumentationRegistered()` completes
- Or have `resetFetch()` only strip the Next.js `patchFetch` layer while preserving any userland wrappers (like `@vercel/otel`)

## Relevant source locations

- `packages/next/src/server/lib/router-server.ts:139` — `originalFetch` captured too early
- `packages/next/src/server/lib/router-server.ts:155-158` — `resetFetch()` restores pre-OTel fetch
- `packages/next/src/server/dev/hot-reloader-turbopack.ts:643` — HMR calls `resetFetch()`
- `packages/next/src/server/dev/hot-reloader-turbopack.ts:1865` — HMR calls `resetFetch()`
- `packages/next/src/server/dev/hot-reloader-webpack.ts:1553` — HMR calls `resetFetch()`
- `@vercel/otel` `packages/otel/src/instrumentations/fetch.ts:469-577` — `instrumentFetch()` wraps `globalThis.fetch`

## Environment

- Next.js: canary
- `@vercel/otel`: ^2.1.2
- Node.js: 22+
