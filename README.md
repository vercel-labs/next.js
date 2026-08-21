# next#86898 — `next.tags` / `next.revalidate` are silently dropped when passed to the `Request` constructor

Next.js augments the global `RequestInit`, so TypeScript accepts
`new Request(url, { next: { tags: [...] } })`, but the native `Request`
constructor drops the non-standard `next` property. `patch-fetch.ts` then reads
`(input as any).next?.tags` and gets `undefined`, so the fetch cache entry is
written with `"tags": []` and `revalidateTag()` can never invalidate it.

Verified on `next@16.3.1-canary.26`, Node 24, `next dev` (Turbopack) and `next build`/`next start`.

## Run

```bash
npm install
node scripts/origin-server.js &   # "remote" endpoint on :4000, returns an incrementing counter
npm run dev                       # or: npm run build && npm start

curl localhost:3000/api/cached-request-forcecache   # {"originHits":1,...}
curl localhost:3000/api/cached-init                 # {"originHits":2,...}
curl localhost:3000/api/revalidate                  # revalidateTag('test-todo')
curl localhost:3000/api/cached-request-forcecache   # 1  <-- BUG: never invalidated
curl localhost:3000/api/cached-init                 # 3  <-- control: invalidated
```

## Routes

| route | how tags are passed | result |
| --- | --- | --- |
| `/api/cached-init` | `fetch(url, { next: { tags } })` | cache entry has `"tags":["test-todo"]`, `revalidateTag` works |
| `/api/cached-request-forcecache` | `new Request(url, { cache: 'force-cache', next: { tags } })` | cache entry has `"tags":[]`, `revalidateTag` has no effect (stale forever) |
| `/api/cached-request` | `new Request(url, { next: { tags, revalidate: 3600 } })` | not cached at all — `next.revalidate` is dropped too, origin hit every request |
| `/api/revalidate` | `revalidateTag('test-todo', 'max')` | |

## Observed cache entries (`.next/dev/cache/fetch-cache/*`)

```json
{"tags":["test-todo"],"revalidate":3600}   // fetch(url, { next: ... })
{"tags":[],"revalidate":31536000}          // new Request(url, { next: ... })
```

`typecheck-note.ts` + `npm run typecheck` shows the type-level half: passing `next`
to the `Request` constructor type-checks cleanly while being `undefined` at runtime.
