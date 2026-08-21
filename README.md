# Repro for vercel/next.js#80627 — `revalidateTag` scope

Two routes hit a local upstream server (port 4000) that logs every request.

- `/` — two tagged fetches **without** `cache: 'force-cache'` (as in the reporter's repo)
- `/forced` — same two fetches **with** `cache: 'force-cache'` + tags

Both pages have a form calling a server action that runs `revalidateTag('health')`.

## Run

```bash
npm install
node upstream.mjs &          # logs every upstream hit
npm run build && npm start & # prod server on :3000
node repro.mjs               # Playwright: load page, click the action, reload
```

## Observed (next 15.3.3, prod)

Upstream log after clicking on `/`: `/health` **and** `/todos` are both re-fetched
(and again on every reload), because tagged `fetch` without `cache: 'force-cache'`
is uncached by default in Next 15, so every re-render refetches everything.

On `/forced`, `revalidateTag('health')` re-fetches **only** `/health`; `todos`
keeps its cached value and the reload issues no upstream request at all — i.e. tag
revalidation is granular once the data is actually cached.
