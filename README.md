# Repro for vercel/next.js#98138

App-shell prefetch (`Next-Router-Prefetch: 3`) misses a `'use cache'` call keyed on a **root** param, and no cache fill is ever attempted during the warming pass.

Key ingredient the reporter was missing: the requested root param value must **not** be in `generateStaticParams`
(here only `en` is prerendered), so the request goes through the runtime prerender architecture
(`generateRuntimePrefetchResult` -> `prospectiveRuntimeServerPrerender(isShellPrefetch: true)`).

## Run

```bash
npm install
npm run build
NEXT_PRIVATE_DEBUG_CACHE=1 npm start

# BROKEN: app-shell prefetch, non-prerendered locale -> truncated payload (~4.1 KB)
curl -sL -o /dev/null -w '%{size_download}\n' -H 'RSC: 1' -H 'Next-Router-Prefetch: 3' http://localhost:3000/es/legal/terms

# CONTROL: same route, prefetch 2 -> full payload (~8.4 KB)
curl -sL -o /dev/null -w '%{size_download}\n' -H 'RSC: 1' -H 'Next-Router-Prefetch: 2' http://localhost:3000/fr/legal/terms
```

(`-L` is needed because Next redirects an `RSC: 1` GET without the `_rsc` query param.)

## Observed on next@16.3.1

prefetch 3:
```
use-cache: Resume Data Cache entry not found [...,["terms","es"]]
Error: Unexpected cache miss after cache warming phase during prerendering. ...
```
No `saved` line: the cached function is never invoked during warming.

prefetch 2 (control): `not found` -> `saved` -> `found`, full payload.

`/en/legal/terms` (prerendered locale) is unaffected.

## Status

Fixed on `next@16.4.0-canary.13`: `createRuntimePrerenderParams` now applies the
`allParamsAreRootParams` short-circuit before the `stagedRendering` check, so root params
resolve during the prospective (warming) runtime prerender too.
Set `"next": "canary"` in package.json to verify: both prefetch modes emit
`not found` -> `saved` -> `found` and return the full payload.
