# next#74218 — Edge runtime `console.error` drops `error.cause`

Minimal repro for https://github.com/vercel/next.js/issues/74218

```
npm install
npm run dev
curl -X POST localhost:3000/api/node
curl -X POST localhost:3000/api/edge
```

Read the dev-server terminal output:

- `/api/node` (nodejs runtime): logs `[cause]: Error: cause ... { body: 'cause body' }`
- `/api/edge` (`export const runtime = "edge"`): logs the error, but the cause section is
  printed as an empty `{ }` — `[cause]` is missing.

Also reproduces with `next build && next start` and with/without Turbopack.
Confirmed on next@15.1.2 and next@16.3.1-canary.25.
