# Repro for vercel/next.js#65764 — Route Handler requested twice (once with `?_rsc=`)

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
npm run check          # playwright: counts requests to /api/redirect
```

Observed (next@16.2.1-canary.26, dev and prod):

* `/from` -> click `<Link prefetch={false} href="/api/redirect">` =>
  **2** requests: `GET /api/redirect?_rsc=...` **and** `GET /api/redirect`.
  Server logs `redirect called` twice. Removing `app/loading.tsx` does not change this.
* `/` -> `redirect('/api/redirect')` in a server component => **1** request
  (this part of the original report is fixed; it produced 2 on next@14.2.3).
