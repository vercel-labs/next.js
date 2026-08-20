# Repro: vercel/next.js#49125 — Link navigation with Suspense is not instant (pages router)

Mirror of https://github.com/net/next-13-suspense-issue, pinned to `next@canary`, React 19.

```
npm install
npm run build && npm run start   # or: npm run dev
```

Open http://localhost:3000, wait for `Page /: Hello John Doe!`, then click "Test 1".

Observed (next@16.3.1-canary.25): URL updates immediately, but nothing repaints for ~2.1s
(the `/api/hello` delay). The `<Suspense>` fallback `Loading...` never appears and the `<Nav />`
outside the boundary keeps highlighting "Home" until the SWR promise resolves.
