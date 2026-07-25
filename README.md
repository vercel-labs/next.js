# Reproduction: `scroll: false` dropped across PPR retry navigations

Reproduces the Next.js App Router bug where `router.replace(url, { scroll: false })` resets
scroll to the top despite `scroll: false` being passed explicitly.

**Affected versions:** 16.1.6, 16.2.0, 16.2.6 (also see the [patch](#patch))  
**Requires:** production build — does **not** reproduce in `next dev`

---

## Steps to reproduce

1. Build and start in production mode:

   ```bash
   npm i && npm run prod
   ```

2. Open http://localhost:3000.
3. Scroll down to the **Filters** section at the bottom.
4. Tick one colour checkbox — the page scrolls back to the top. ❌

---

## Root cause

### The buggy line

`server-patch-reducer.js` (Next.js 16.1.6) hardcodes scroll-to-top on every retry navigation:

```js
// server-patch-reducer.js (unpatched)
const shouldScroll = true;  // ← always resets scroll
```

The `shouldScroll` value from the original `router.replace(..., { scroll: false })` call is
never threaded through to the retry, so `scroll: false` is silently discarded.

### How the retry is triggered

On a `force-dynamic` page, every navigation goes through the segment cache. When there is no
exact prefetch cache hit, Next.js checks for an *optimistic* route — a cache entry for the same
pathname but with an empty search string. If one exists, the navigation takes the optimistic
path:

```
router.replace('?color=red', { scroll: false })
  → navigate()
    → requestOptimisticRouteCacheEntry()   // succeeds if '/' was prefetched
      → navigateUsingPrefetchedRouteTree()
        → spawnDynamicRequests()           // spawns a live server fetch
          → finishNavigationTask()         // awaits the response
            → writeDynamicDataIntoNavigationTask()
              // server returns different tree (force-dynamic re-rendered with ?color=red)
              → didReceiveUnknownParallelRoute = true  OR  abortRemainingPendingTasks = 1
                → dispatchRetryDueToTreeMismatch()
                  → ACTION_SERVER_PATCH
                    → server-patch-reducer (shouldScroll = true) ❌
```

The optimistic route cache entry for `/` is populated by Next.js when the user hovers over a
`<Link href="/">` (Next.js prefetches linked routes on hover/viewport entry). Without that
prefetch, every navigation falls through to `navigateDynamicallyWithNoPrefetch`, which fetches
inline and never reaches `finishNavigationTask` — so the bug is not triggered.

This is why the bug only manifests after interacting with the page (triggering a prefetch), and
why it does not reproduce in `next dev` (prefetching is disabled in development).

### Why the second checkbox tick, not the first

The first tick navigates from `/` → `?color=red`. The optimistic route is built from the cached
`/` entry. The server responds with the `?color=red` tree, which differs from the optimistic
tree (because `force-dynamic` re-renders on every navigation) → mismatch → retry with
`shouldScroll = true` → scroll reset.

The same mechanism fires on every subsequent tick.

---

## Patch

Three files in `node_modules/next/dist/` need to be patched to thread `scrollBehavior` through
the retry path. See the full diff in
[`next-js-scroll-issue-report.md`](./next-js-scroll-issue-report.md).

The fix in `server-patch-reducer.js` is:

```diff
-const shouldScroll = true;
+const shouldScroll = action.shouldScroll !== undefined ? action.shouldScroll : true;
```

The other two patches ensure `shouldScroll` is passed into `spawnDynamicRequests` →
`finishNavigationTask` → `dispatchRetryDueToTreeMismatch` → the retry action, so it arrives
at `server-patch-reducer` in the first place.
