# Repro: mobx-react in the App Router (issue #50638)

The original issue (#50638) has no reproduction link ("blalba"). This is a minimal
reproduction of the reported error message.

Result on next@canary (16.3.1-canary.25), mobx-react@10, react@19:

- `/` — `observer()` inside a `'use client'` component: works, count increments (no error).
- `/server` — importing `mobx-react` from a Server Component: dev returns HTTP 500 and
  `next build` fails with `Error: mobx-react-lite requires React 18 or later`
  (older mobx-react-lite versions phrase this as "requires React with Hooks support").

## Run

```bash
npm install --legacy-peer-deps
npm run dev      # visit http://localhost:3000/ (works) and /server (500)
npx next build   # fails: Failed to collect page data for /server
```
