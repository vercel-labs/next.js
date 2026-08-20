# Repro: vercel/next.js#46737 — `cache: "no-store"` fetch inside try/catch breaks `next build`

The reporter's original repo (`TomRoberto/test-cache-nostore`) returns 404, so this is a minimal recreation.

```bash
npm install
npm run build   # fails
```

- `app/page.js` — uncached fetch wrapped in `try/catch` (reporter's code). Build fails:
  the internal `DynamicServerError` (`digest: 'DYNAMIC_SERVER_USAGE'`) is swallowed by the
  user `catch`, so Next never learns the route is dynamic, `fetchData()` returns `undefined`
  and prerendering fails with `TypeError: Cannot read properties of undefined (reading 'results')`.
- `app/no-try-catch/page.js` — same fetch without try/catch. Builds fine and is marked `ƒ (Dynamic)`.

Still reproduces on next@16.3.1-canary.25 (Turbopack build).
