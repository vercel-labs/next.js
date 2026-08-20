# Reproduction for vercel/next.js#62740

`output: 'export'` App Router prefetch payloads are written as `.txt` files whose
URLs (path **and** the `_rsc` cache-busting query) are identical across deploys.
A CDN/browser that caches them therefore serves a payload from the previous
deploy after a new one, which forces a hard full-page reload instead of a client
navigation.

Verified with `next@16.3.1` (Node 24). The same stable hash exists on the version
in the issue report (`next@14.1.0` requests `/index.txt?_rsc=acgkz`, exactly the
hash quoted by the reporter).

## Run

```bash
npm install
npm run build:a   # "deploy A" -> outA/
npm run build:b   # "deploy B" -> outB/  (different page content, new buildId)
npm run verify    # playwright: fresh cache vs. stale cached .txt
```

`static-host.js` is a strict static file host (no rewrites). With `STALE=1`
(default) it serves every `*.txt` from deploy A while serving HTML/JS from
deploy B — i.e. exactly what a CDN or browser cache does, because the URLs are
identical.

## Observed (next@16.3.1)

Fresh cache (`STALE=0`) — soft client navigation:

```
net 200 /about/__next._tree.txt?_rsc=5CB68i4pnAekjehf
net 200 /about/__next.about.__PAGE__.txt?_rsc=hzcUC6YqarYE9pKE
NAV /about        (no extra document request, 7 chunk requests total = initial load only)
```

Deploy A's `.txt` still cached while deploy B is live (identical URLs):

```
net 200 /about/__next._tree.txt?_rsc=5CB68i4pnAekjehf   <- stale (deploy A)
net 200 /about.txt?_rsc=QLBdCDjfpGkLRHBX                <- stale full payload (deploy A)
net 200 /about                                          <- hard document navigation
NAV /about        (13 chunk requests: everything re-downloaded)
```

The path and the `_rsc` query values are byte-identical between deploy A and
deploy B even though the payload contents and `buildId` changed, so the prefetch
payload URLs are effectively un-versioned for static exports and any cache hit
costs the user a full page reload.
