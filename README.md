# Repro: `examples/with-msw` dynamic `import()` races with initial client requests (vercel/next.js#43284)

`mocks/index.ts` in `examples/with-msw` calls `initMocks()` without awaiting it, and
`initMocks()` itself uses `await import('./browser')` + `worker.start()` (both async).
`pages/_app` therefore returns before MSW is ready, so any request made on initial
mount is **not** intercepted.

Files `pages/_app.js` and `mocks/index.js` are verbatim copies of the canary example
(only converted from TS). `pages/index.js` fetches `/reviews` in `useEffect` on mount.

## Run

```bash
npm install
npm run dev            # dev server on :3000
npm run repro          # Playwright: loads the page, prints the result
```

Output (Next 16.3.1-canary.25, msw 2.11.x):

```
FIRST LOAD (fresh browser profile, no active service worker):
  status=404 intercepted=NO (not mocked by MSW)
AFTER RELOAD (service worker already registered):
  status=404 intercepted=NO (not mocked by MSW)
LATE FETCH (same URL, issued after MSW finished starting):
  status=200 body=[{"id":"1","author":"John Maverick","text":"mocked review"}]
```

The mount-time request hits the Next dev server (404) and the MSW "Mocking enabled"
banner is logged *after* it; the identical request issued later is mocked (200),
confirming a pure startup race, not a handler problem.
