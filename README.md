# Repro: `revalidatePath()` expires `use cache` entries with `cacheLife('hours')` (issue #86760)

Next.js `16.3.1-canary.26`, `cacheComponents: true`.

`app/data.ts` exports `getRoleName(accountId)` with `"use cache"` + `cacheLife("hours")`.
`/` and `/shared` both render `getRoleName(1)`. `GET /api/revalidate?path=<p>` calls
`revalidatePath(p)`.

## Steps (prod)

```bash
pnpm install
pnpm build
NEXT_PRIVATE_DEBUG_CACHE=1 pnpm start -p 3000
# note producedAt
curl -s localhost:3000/ | grep -o '20[0-9-]*T[0-9:.]*Z' | head -1
# unrelated path: cache survives
curl -s 'localhost:3000/api/revalidate?path=/other'
curl -s localhost:3000/ | grep -o '20[0-9-]*T[0-9:.]*Z' | head -1
# own path: cached function body re-runs even though cacheLife is 1 hour
curl -s 'localhost:3000/api/revalidate?path=/'
curl -s localhost:3000/ | grep -o '20[0-9-]*T[0-9:.]*Z' | head -1
# then revalidate the other route that uses the SAME cached function -> another MISS
curl -s 'localhost:3000/api/revalidate?path=/shared'
```

Server log prints `[getRoleName] MISS (function body ran) ...` on every path
revalidation. Same behavior in `pnpm dev`.
