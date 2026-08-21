# Repro: next.js#76073 — `next build --debug` logs "Static generation failed due to dynamic usage" for correctly dynamic routes

Minimal, repaired version of the reporter's repro
(https://github.com/vicasas/next.js-dynamic-routes-not-worker, where the two
interesting pages were checked in disabled as `_pageabc.tsx`).

## Run

```bash
npm install
npm run build:debug
```

## Observed

`next build --debug` prints `Error: Static generation failed due to dynamic usage`
for `/dynamic-route/search-params` and `/dynamic-route/fetch-no-store`, even
though the build succeeds and both routes are correctly reported as `ƒ (Dynamic)`
in the route summary. On Next 15.1.7 the `fetch-no-store` message additionally
blames the wrong API (`await searchParams`); on canary the reason is correct
(`revalidate: 0 fetch ...`) but it is still logged as an `Error`.
`next build` (without `--debug`) prints nothing. These are debug diagnostics of the internal static-shell
prerender pass, not real failures, but they read as build errors.

Reproduced on next@15.1.7 and next@16.3.1-canary.26.
