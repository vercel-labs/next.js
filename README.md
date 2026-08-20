# Repro: `redirect()` to the same route with different query params and client state (issue #64913 / #64793)

Minimal App Router app: a Server Component page that prints `searchParams.t`, a Client
Component with `useState` items, and a Server Action that calls
`redirect('/?t=' + Date.now())` (same route, different query string).

## Run

```bash
npm install         # next: latest by default
npm run dev
# in another shell (needs `npm i playwright && npx playwright install chromium`)
PORT=3000 node verify.mjs
```

Manual steps: open `/`, click **Add Client Item** twice, then click
**Click Me (server action redirect)**.

## Observed

| next     | server-rendered value | client `useState` items after redirect |
| -------- | --------------------- | -------------------------------------- |
| 14.2.2   | updated               | **preserved (2)** – behavior described in #64793/#64913 |
| 15.5.4   | updated               | reset to 0                             |
| 16.3.1   | updated               | reset to 0                             |

In all versions the navigation stays client-side (a `window` global set before the
redirect survives), only the React tree differs: 14.2.2 keeps the Client Component
mounted, 15.x/16.x remount it.

To check 14.2.2: `npm i next@14.2.2 react@18.2.0 react-dom@18.2.0` and change
`app/page.js` to use `searchParams` synchronously.
