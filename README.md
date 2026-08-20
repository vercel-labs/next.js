# Repro: module (and its side effects) persists across HMR — vercel/next.js#69098

Minimal stand-in for `msw`'s `setupWorker()`: `src/mocks/worker.js` registers a
`window` event listener + a keepalive `setInterval` when the module is evaluated,
exactly like msw does. `src/mocks/browser.js` imports the payload from
`src/mocks/handlers.js`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # Turbopack; add --webpack for webpack
node test-hmr.mjs      # automated: clicks, edits handlers.js, clicks again
```

Manual: open http://localhost:3000, DevTools console, click "Fetch movies"
(1 `[mock] ... handled` log). Edit a movie title in `src/mocks/handlers.js`,
save, click again.

## Expected

One `handled` log per click — the previous module instance and its listener /
interval should be disposed on hot update.

## Actual (next@16.3.1, both Turbopack and webpack)

Every hot update adds one more surviving worker instance:

```
initial:            1 handler invocation per click   (worker-1)
after HMR edit #1:  2                                (worker-1, worker-2)
after HMR edit #2:  3                                (worker-1..3)
after HMR edit #3:  4                                (worker-1..4)
```

Old instances still report the pre-edit payload, i.e. the old module evaluation
is still live.
