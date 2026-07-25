# `scroll: false` not preserved across async PPR retry navigations (force-dynamic pages)

**Next.js version:** 16.2.6 (also reproduced on 16.1.6 and 16.2.0)  
**Affected area:** App Router, PPR, `router.replace` / `router.push` with `{ scroll: false }`

---

## Summary

When calling `router.replace(url, { scroll: false })` on a `force-dynamic` page, the browser scrolls to the top of the page intermittently. The scroll reset is not triggered by the initial navigation, but by a subsequent async retry navigation that Next.js spawns internally (`dispatchRetryDueToTreeMismatch`). The retry discards the original `scroll: false` option and falls back to `ScrollBehavior.Default`, which resets scroll position.

---

## Steps to reproduce

1. Create an App Router page with `export const dynamic = 'force-dynamic'`.
2. Call `router.replace('?someParam=value', { scroll: false })` from a client component on that page.
3. Observe: on the **first** navigation the scroll position is preserved correctly.
4. Trigger a second navigation that changes the same URL parameter (e.g. array param growing from one value to two).
5. Observe: scroll jumps to top despite `scroll: false`.

**Key characteristics:**

- Only reproducible in **production builds** (`next build && next start`). Does not reproduce in dev mode (`next dev`).
- Triggered by the **second** navigation to the same URL parameter, not the first.
- Does not occur when navigating to a **different** URL parameter.
- Only on `force-dynamic` pages (RSC re-render is triggered on every navigation).

---

## Root cause

`force-dynamic` pages trigger a full RSC re-render on every navigation. When the server response causes a router tree mismatch, Next.js dispatches a retry action via `dispatchRetryDueToTreeMismatch` in `ppr-navigations.js`.

The retry action is constructed in `server-patch-reducer.js` and always sets `scrollBehavior` to `ScrollBehavior.Default`:

```js
// server-patch-reducer.js (Next.js 16.2.6, unpatched)
const scrollBehavior = _routerreducertypes.ScrollBehavior.Default;
```

The `scrollBehavior` from the original navigation (passed as `{ scroll: false }`) is not threaded through `spawnDynamicRequests` → `finishNavigationTask` → `dispatchRetryDueToTreeMismatch` → the retry action. So by the time the retry resolves, the scroll intent has been lost.

---

## Patch we applied

We patched three files in `dist/`:

```diff
diff --git a/dist/client/components/router-reducer/ppr-navigations.js b/dist/client/components/router-reducer/ppr-navigations.js
--- a/dist/client/components/router-reducer/ppr-navigations.js
+++ b/dist/client/components/router-reducer/ppr-navigations.js
@@ -821,7 +821,9 @@ function spawnDynamicRequests(task, primaryUrl, nextUrl, freshnessPolicy, accumu
 routeCacheEntry, // The original navigation's push/replace intent. Threaded through to the
 // server-patch retry logic so it can inherit the intent if the original
 // transition hasn't committed yet.
-navigateType) {
+navigateType, // The original navigation's scroll behavior. Threaded through to preserve
+// scroll: false across async retry navigations.
+scrollBehavior) {
     const dynamicRequestTree = task.dynamicRequestTree;
     if (dynamicRequestTree === null) {
         // This navigation was fully cached. There are no dynamic requests to spawn.
@@ -878,12 +880,12 @@ navigateType) {
     }
     // Further async operations are moved into this separate function to
     // discourage sequential network requests.
-    const voidPromise = finishNavigationTask(task, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType);
+    const voidPromise = finishNavigationTask(task, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType, scrollBehavior);
     // `finishNavigationTask` is responsible for error handling, so we can attach
     // noop callbacks to this promise.
     voidPromise.then(noop, noop);
 }
-async function finishNavigationTask(task, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType) {
+async function finishNavigationTask(task, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType, scrollBehavior) {
     // Wait for all the requests to finish, or for the first one to fail.
     let exitStatus = await waitForRequestsToFinish(primaryRequestPromise, refreshRequestPromises);
     // Once the all the requests have finished, check the tree for any remaining
@@ -910,7 +912,7 @@ async function finishNavigationTask(task, nextUrl, primaryRequestPromise, refres
                 // happen in a row, fall back to a hard retry.
                 const isHardRetry = false;
                 const primaryRequestResult = await primaryRequestPromise;
-                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType);
+                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType, scrollBehavior);
                 return;
             }
         case 2:
@@ -925,7 +927,7 @@ async function finishNavigationTask(task, nextUrl, primaryRequestPromise, refres
                 // doesn't exist yet.
                 const isHardRetry = true;
                 const primaryRequestResult = await primaryRequestPromise;
-                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType);
+                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType, scrollBehavior);
                 return;
             }
         default:
@@ -978,7 +980,8 @@ function dispatchRetryDueToTreeMismatch(isHardRetry, retryUrl, retryNextUrl, see
 // prediction. If the navigation results in a mismatch, we mark it as having
 // a dynamic rewrite so future predictions bail out.
 routeCacheEntry, // The original navigation's push/replace intent.
-originalNavigateType) {
+originalNavigateType, // The original navigation's scroll behavior.
+originalScrollBehavior) {
     // If the navigation used a route prediction, mark it as having a dynamic
     // rewrite since it resulted in a mismatch.
     if (routeCacheEntry !== null) {
@@ -1026,7 +1029,8 @@ originalNavigateType) {
         nextUrl: retryNextUrl,
         seed,
         mpa: isHardRetry,
-        navigateType: retryNavigateType
+        navigateType: retryNavigateType,
+        scrollBehavior: originalScrollBehavior
     };
     (0, _useactionqueue.dispatchAppRouterAction)(retryAction);
 }

diff --git a/dist/client/components/router-reducer/reducers/server-patch-reducer.js b/dist/client/components/router-reducer/reducers/server-patch-reducer.js
--- a/dist/client/components/router-reducer/reducers/server-patch-reducer.js
+++ b/dist/client/components/router-reducer/reducers/server-patch-reducer.js
@@ -41,7 +41,9 @@ function serverPatchReducer(state, action) {
     // using the tree we just received from the server.
     const retryCanonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(retryUrl);
     const retryNextUrl = action.nextUrl;
-    const scrollBehavior = _routerreducertypes.ScrollBehavior.Default;
+    // Preserve the original scroll behavior from the navigation that triggered the retry.
+    // This ensures that scroll: false is respected across async retry navigations.
+    const scrollBehavior = action.scrollBehavior !== undefined ? action.scrollBehavior : _routerreducertypes.ScrollBehavior.Default;
     const now = Date.now();
     return (0, _navigation.navigateToKnownRoute)(now, state, retryUrl, retryCanonicalUrl, retrySeed, currentUrl, currentRenderedSearch, state.cache, state.tree, _pprnavigations.FreshnessPolicy.RefreshAll, retryNextUrl, scrollBehavior, navigateType, null, // Server patch (retry) navigations don't use route prediction. This is
     // typically a retry after a previous mismatch, so the route was already

diff --git a/dist/client/components/segment-cache/navigation.js b/dist/client/components/segment-cache/navigation.js
--- a/dist/client/components/segment-cache/navigation.js
+++ b/dist/client/components/segment-cache/navigation.js
@@ -144,7 +144,7 @@ routeCacheEntry) {
     const task = (0, _pprnavigations.startPPRNavigation)(now, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, navigationSeed.routeTree, navigationSeed.metadataVaryPath, freshnessPolicy, navigationSeed.data, navigationSeed.head, navigationSeed.dynamicStaleAt, isSamePageNavigation, accumulation);
     if (task !== null) {
         if (freshnessPolicy !== _pprnavigations.FreshnessPolicy.Gesture) {
-            (0, _pprnavigations.spawnDynamicRequests)(task, url, nextUrl, freshnessPolicy, accumulation, routeCacheEntry, navigateType);
+            (0, _pprnavigations.spawnDynamicRequests)(task, url, nextUrl, freshnessPolicy, accumulation, routeCacheEntry, navigateType, scrollBehavior);
         }
         return completeSoftNavigation(state, url, nextUrl, task.route, task.node, navigationSeed.renderedSearch, canonicalUrl, navigateType, scrollBehavior, accumulation.scrollRef, debugInfo);
     }
```

---

## Why `window.history` is not a viable workaround

Bypassing the Next.js router via `window.history.replaceState(null, '', url)` avoids the scroll reset, but it also skips the RSC re-render — meaning other components on the page that depend on server data are not updated. This makes it unsuitable for pages where server-rendered content must stay in sync with URL state.

## Expected behaviour

`router.replace(url, { scroll: false })` should preserve scroll position regardless of whether the navigation results in an RSC tree mismatch and triggers a retry.

## Actual behaviour

Scroll position is reset to the top on retry navigations, even when `scroll: false` was explicitly passed.

---
