# Repro: #97846 — `useMutation` fired from a mount `useEffect` never re-renders on error (Next 16.3, App Router, dev)

No tRPC needed: a plain `useMutation` whose `mutationFn` throws (HTTP 200 + error envelope) is enough.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # http://localhost:3000
npm run verify         # headless check, prints statuses
```

`verify` loads `/`, waits 4s, prints `effect-status`, then clicks the button that
fires the same mutation from an onClick handler and prints `click-status`.

## Result with `next@16.3.2` (dev, Turbopack **and** `--webpack`)

```
console: [repro] onError Error: reconcile failed
console: [repro] onSettled
effect-status after 4s: pending      <-- BUG (expected: error)
click-status after click: error      <-- same mutationFn, fired from a click: fine
```

## Result with `next@16.2.12` (`npm i next@16.2.12`)

```
effect-status after 4s: error        <-- correct
```

## Matrix

| Next | mode | router | result |
| --- | --- | --- | --- |
| 16.3.2 | `next dev` (Turbopack) | App | stuck on `pending` |
| 16.3.2 | `next dev --webpack` | App | stuck on `pending` |
| 16.3.2 | `next build && next start` | App | `error` (ok) |
| 16.3.2 | `next dev` | Pages (`/pages-test`, same component) | `error` (ok) |
| 16.3.0 | `next dev` | App | stuck on `pending` |
| 16.2.12 | `next dev` | App | `error` (ok) |

Pages Router uses the app's own `react` 19.2.7, App Router uses the React vendored in
Next: `19.3.0-canary-3f0b9e61-20260317` in 16.2.12 vs `19.3.0-canary-cbb046ab-20260731`
in 16.3.0/16.3.2 — so the regression tracks the vendored dev React build, not the bundler.
