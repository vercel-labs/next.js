# Repro attempt for vercel/next.js#73474 — "loading.tsx and Suspense do not work on second page load and on"

Minimal, DB-free version of the reporter's setup (the original repo https://github.com/Vovch/test-next-2
cannot be run as-is: it needs a private Postgres connection string in `.env`).

* `/dashboard` — page shell renders instantly, a 3s async child is wrapped in `<Suspense>`; the route
  also has `app/dashboard/loading.tsx`.
* `/slowpage` — the page component itself awaits 3s, so `app/slowpage/loading.tsx` must stream first.
* Both routes are `force-dynamic` so `next start` cannot prerender them.

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
node stream.js http://localhost:3000/dashboard   # raw HTTP chunk timeline
node check.js run                                # Chromium: 3 hard reloads of /dashboard
URL=http://localhost:3000/slowpage node check.js slowpage
BASE=http://localhost:3000 node nav.js           # client-side navigation
```

## Result (Linux, Node 24, headless Chromium)

Not reproducible. Every request — first, second, third, dev and `next start`, hard reload and soft
navigation — streams the shell/fallback in ~20-90ms and flushes the slow content at ~3s:

```
chunk#1 t=26ms  DASHBOARD_SHELL, SUSPENSE_FALLBACK
chunk#4 t=28ms  LOADING_TSX_FALLBACK
chunk#8 t=3020ms SLOW_DATA
```

Verified with next 15.0.4-canary.36 + react 18.2.0 (the reported combination) and with
next 16.3.1-canary.25 + react 19.2.0. Since the HTML is flushed early at the socket level, the
reported "nothing until everything is done" symptom points at something buffering the response
between the dev server and the browser (Windows AV/proxy, as several issue comments report), not at
Next.js' streaming.
