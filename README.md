# Reproduction attempt for vercel/next.js#55168 — "Request memoization sometimes doesn't work"

The reporter's CodeSandbox is no longer publicly readable (HTTP 403), so this is a minimal
equivalent harness: the same `getData()` fetch (`cache: 'no-store'`) is awaited in
`app/layout.js`, `app/dashboard/layout.js`, `app/dashboard/page.js` and in
`generateMetadata()` of `/dashboard`. A tiny counter server logs every upstream request.

## Run

```bash
npm install
node counter-server.js          # terminal 1 (port 8088)
npm run dev                     # terminal 2 (Turbopack, port 3001)
# or: npm run dev:webpack
npm run check                   # terminal 3 -> reloads /dashboard 4 times
```

## Result on next@16.3.1-canary.25 (Node runtime, dev)

`reload 1..4: upstream fetches during render = 1` — memoization holds on the first load and
on every subsequent reload, with Turbopack and with `--webpack`, before and after HMR edits,
and also with `react`'s `cache()` (including when the module is imported through two
different specifiers). `next build && next start` behaves the same.

The same harness on `next@13.4.19` (the version in the original report) also deduped to
1 upstream fetch per reload, so the exact trigger of the original report is not captured
by this minimal app.
