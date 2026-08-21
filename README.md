# Repro: `"use cache"` ignores the legacy top-level `cacheHandler` (next.js#82993)

Minimal reproduction of https://github.com/vercel/next.js/issues/82993 on `next@16.3.1-canary.26`.

`legacy-cache-handler.js` is registered via the top-level `cacheHandler` option and logs every
`get`/`set`. `use-cache-handler.js` is a `cacheHandlers.default` handler (the `use cache` API).

## Run

```bash
npm install
npm run build && npm start          # only the legacy `cacheHandler` is registered
curl localhost:3000/use-cache; curl localhost:3000/use-cache
curl localhost:3000/unstable-cache; curl localhost:3000/unstable-cache
```

Server log:

* `/unstable-cache` -> `[legacy-cache-handler] get/set <hash>` and the work function runs once.
* `/use-cache` -> the legacy handler only ever sees the page-level key `/use-cache`; the
  `"use cache"` entry itself never reaches it (it goes to Next.js' built-in in-memory handler).

Now register a `use cache` handler:

```bash
USE_CACHE_HANDLERS=1 npm run build && USE_CACHE_HANDLERS=1 npm start
curl localhost:3000/use-cache; curl localhost:3000/use-cache
```

Server log now shows `[use-cache-handler] get/set ["<buildId>","<id>",[]]` and the work function
runs only on the first request => `use cache` requires `experimental.cacheHandlers`, it does not
fall back to the legacy `cacheHandler`.
