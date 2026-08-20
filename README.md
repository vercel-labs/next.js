# Reproduction for vercel/next.js#73374

Production Next.js server aborts the Node process at **startup** with
`Assertion failed: env->async_hooks_init_function().IsEmpty()` when any route module
loads a package that calls `process.binding('async_wrap').setupHooks()` at require time
(e.g. `async-hook-jl`, pulled in by `cls-hooked` / `express-http-context` legacy path).

Requires **Node 20** (on Node >= 22 `process.binding('async_wrap')` throws instead of aborting).

```bash
npm install
npm run build          # next build --webpack
npm start              # or: npm run custom-server
```

## Observed

Next 15/16: the process aborts before the server is ready, because
`NextNodeServer` calls `unstable_preloadEntries()` in its constructor
(`experimental.preloadEntriesOnStart` defaults to `true`), which eagerly `require()`s
every built route entry, including `.next/server/pages/api/legacy.js`.

Next 14: the server starts and serves `/`; the abort only happens when `/api/legacy` is requested.

Setting `experimental: { preloadEntriesOnStart: false }` in `next.config.js` restores the
Next 14 behaviour (server boots, crash deferred to the request that touches the route).
