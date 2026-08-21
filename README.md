# Repro: `text/x-component` served for document requests behind an IIS-style reverse proxy (#81444)

The reporter's linked repo (`esadbacaci/nextjs-iis-issue-demo`) returns 404, so this is a
minimal standalone reproduction of the reported symptom.

```bash
npm install
npm run build
npm start &                 # Next.js on :3000
node iis-proxy.js &             # proxy on :8080 (path-only output cache, ignores `Vary`)

# 1) an RSC prefetch/navigation request populates the proxy cache
curl -sI -H 'RSC: 1' 'http://127.0.0.1:8080/login?_rsc=abc'
# 2) a plain browser document request now gets the cached RSC payload
curl -sI 'http://127.0.0.1:8080/login'   # -> content-type: text/x-component
```

Set `IGNORE_VARY=0 node iis-proxy.js` to make the proxy honour `Vary` (no cache): the same
document request returns `text/html`, showing Next.js itself is correct and the bug is in
the proxy/output-cache configuration.

## Observed (Next.js 16.3.1-canary.26, `next start`)

| request | via | content-type |
|---|---|---|
| `GET /login` (document) | Next.js directly | `text/html; charset=utf-8` (+ `Vary: rsc, next-router-state-tree, ...`) |
| `GET /login?_rsc` + `RSC: 1` | Next.js directly | `text/x-component` |
| `GET /login` (document) | proxy after the RSC request warmed the path-only cache | **`text/x-component`** (`x-proxy-cache: HIT`) — headless Chromium renders the raw flight payload as text |
| `GET /login` (document) | proxy with `IGNORE_VARY=0` | `text/html; charset=utf-8` |

Next.js always sends `Vary: rsc, next-router-state-tree, next-router-prefetch,
next-router-segment-prefetch, Accept-Encoding`. Any reverse proxy / output cache in front of
it (IIS ARR + output caching, nginx `proxy_cache` without `$is_args$args`, CDN) must include
those request headers (or at least the `_rsc` query string) in the cache key.
