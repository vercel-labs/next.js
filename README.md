# Repro: `preloadEntriesOnStart` does not preload middleware (vercel/next.js#84380)

## Run

```bash
pnpm i
pnpm build
pnpm start          # note the server log
# in another terminal, twice:
curl -w "total: %{time_total}\n" -o /dev/null -s http://localhost:3000
```

## Expected

`experimental.preloadEntriesOnStart` (default `true`) should evaluate the middleware
bundle during startup, so no request pays the module-evaluation cost.

## Actual (next 15.5.4 and 16.3.1-canary.25)

At startup only the App Router entry is preloaded:

```
✓ Ready in 328ms
[page module] evaluated at ...
```

The middleware module is evaluated lazily on the **first** request:

```
req1 total: 2.126129
req2 total: 0.018122
[middleware] module evaluated in 2000ms
```

`middleware.js` contains a 2s busy loop at module scope to make the lazy
evaluation obvious in request timings.

## Note

`NextNodeServer.unstable_preloadEntries()` iterates only `pages-manifest.json` and
`app-paths-manifest.json`; `middleware-manifest.json` entries are never loaded.
