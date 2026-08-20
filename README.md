# Repro for vercel/next.js#51581 — React error #419 with `useSearchParams()` inside `<Suspense>`

Minimal App Router app implementing the docs' `NavigationEvents` pattern: a client component
calling `usePathname()` / `useSearchParams()` wrapped in `<Suspense>`, rendered from a client
provider that sits between `<html>` and `<body>` in the root layout (the shape used by the
PostHog / Segment snippets in the issue thread).

## Run

```bash
npm install
npm run build
npm start
# open http://localhost:3000 with the browser console open
```

## Result matrix (verified locally, headless Chromium, production build)

| next | react/react-dom | console on first load |
| --- | --- | --- |
| 15.1.6 | 19.0.0 | `Uncaught Error: Minified React error #419` |
| 15.3.9 | 19.0.0 | clean |
| 15.5.23 | 19.0.0 | clean |
| 16.3.1 | 19.2.0 | clean |
| 16.3.1-canary.25 | 19.2.0 (also with 19.0.0) | clean |

To see the failing case, change `next` to `15.1.6` and `react`/`react-dom` to `19.0.0`,
reinstall, rebuild and reload.

Notes:
- The prerendered HTML still contains `<!--$!--><template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">`
  on every version above; only the surfacing of the recoverable error to the console changed.
- On 16.3.1-canary.25 the pattern is also clean in `next dev`, with `experimental.cacheComponents: true`
  (PPR resume), and with `output: 'export'`.
