# Repro: `TypeError: Cannot read properties of undefined (reading 'call')` on a server action after a redeploy

Deterministic reproduction for https://github.com/vercel/next.js/issues/70703 (Next.js 14.2.14, webpack, `next build && next start`).

## Run

```bash
npm install
npx playwright install chromium
npm run build:versions   # builds .next-v1 and .next-v2 ("two deployments")
npm run repro            # loads v1 in Chromium, swaps the server to v2, then clicks the server action
```

Expected output (reproduced):

```
loaded v1: Demo
v1 server stopped
deployed v2; old tab still open.
--- errors ---
console: TypeError: Cannot read properties of undefined (reading 'call')
    at d (http://localhost:3000/_next/static/chunks/webpack-<hash>.js:1:152)
    ...
```

The React tree unmounts (the page body is wiped) exactly like the reports in the issue.

## Mechanism

1. The browser tab is running deployment **v1**. The chunk for `app/page` (webpack chunk id `931`) is
   already in `installedChunks`, and `app/Client.js` has module id `5772` in that build.
2. Deployment **v2** is a normal code change; webpack's deterministic module id for the client component
   changes (here forced by moving `app/Client.js` -> `app/ClientRenamed.js`), while the **chunk id stays `931`**.
3. The old tab POSTs the server action. The response is a flight payload produced by **v2**:
   `3:I[593,["931","static/chunks/app/page-<v2 hash>.js"],"Client"]`.
4. The client resolves chunks by **chunk id** through the old build's `__webpack_require__.u`, and chunk `931`
   is already marked installed, so **no script is fetched** (no 404, no `ChunkLoadError`).
5. `__webpack_require__(593)` then runs `__webpack_modules__[593].call(...)` on `undefined` ->
   `TypeError: Cannot read properties of undefined (reading 'call')`.

This matches the reports that there is no failing network request and that the crash happens client-side
right around a server action / redirect after a new deployment (Skew Protection expired or not applicable).

`app/cjs-util.js` assigns to `this` at module scope on purpose: that is what makes webpack emit the
`__webpack_modules__[id].call(module.exports, ...)` runtime form quoted in the issue. Without such a module
the very same failure surfaces as `TypeError: a[e] is not a function` from the same runtime frame.

## Versions

- `next@14.2.14` + webpack: reproduces (error thrown, app crashes).
- `next@15.5.4` + webpack: reproduces (same `TypeError` from the webpack runtime frame).
- `next@16.3.1` + `next build --webpack`: does **not** crash; the router aborts the action request and
  hard-reloads the page onto the new deployment instead.
