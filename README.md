# Repro: `router.push` duplicates `basePath` (`/app/app/...`) — vercel/next.js#80852

Next.js 15.3.4, Pages Router, `basePath: '/app'`.

## Cause

1. `Router.push('/cars/3299')` runs `prepareUrlAs`, which already prefixes `as` with the
   basePath → `as === '/app/cars/3299'`.
2. `change()` then calls `this._bfl(as, ...)` with that **already prefixed** `as`
   (`shared/lib/router/router.ts`).
3. Inside `_bfl` the client-router bloom filter (`experimental.clientRouterFilter`, on by
   default when an `app/` dir exists) is probed with `asNoSlash = '/app/cars/3299'` **and**
   `addBasePath(asNoSlash) = '/app/app/cars/3299'`.
4. On a filter hit (a false positive is enough — the filter is probabilistic, which is why
   only *some* ids break) it hard-navigates to `addBasePath(as)` =
   **`/app/app/cars/3299`** → 404.

`3299` here is a deterministic bloom-filter false positive for this app's filter data
(`__routerFilterStatic` in `.next/static/<buildId>/_buildManifest.js`), so the bug is
reproducible on demand; `1` is a control that navigates correctly.

## Steps

```bash
npm install
npm run build
npm start           # http://localhost:3000/app
node repro.js       # playwright, prints the resulting URLs
```

Manually: open `http://localhost:3000/app`, click `router.push("/cars/1")` → OK
(`/app/cars/1`), click `router.push("/cars/3299")` → **`/app/app/cars/3299`, 404**.

## Observed

```
router.push("/cars/1")    -> http://localhost:3000/app/cars/1        (renders "car 1")
router.push("/cars/3299") -> http://localhost:3000/app/app/cars/3299 (404)
```

Setting `experimental: { clientRouterFilter: false }` makes both pushes work
(verified), matching the workaround reported in the issue.
