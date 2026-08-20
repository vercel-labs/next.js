# Reproduction for vercel/next.js#49297

`loading.tsx` is not shown when navigating to the **same route** with different
search params; the URL only updates once the full server response arrives.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start   # or: npm run dev
```

Open http://localhost:3000/a?page=1 (3s server delay per render).

- Click **A?page=2** (same route, new search params) -> no `app/a/loading.tsx`,
  URL stays `?page=1` for ~3s, then content swaps.
- Click **to B** (different route) -> `app/b/loading.tsx` appears immediately.

Automated check (server must be running on :3000):

```bash
npm run test:nav
```

Observed on next@16.3.1-canary.25:

```
{ "loadingSeenMs": null, "urlChangedMs": 3066, "contentChangedMs": 3068 }
different-route loading shown at ms: 73
```
