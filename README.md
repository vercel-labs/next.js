# repro: `revalidatePath` does not purge Vercel CDN cache of Route Handlers (vercel/next.js#66680)

Next.js 16.3.1, deployed to Vercel.

## Routes
- `GET /api/script/[variable]` – route handler returning a timestamp with `Vercel-CDN-Cache-Control: max-age=86400`
- `GET /api/script` – same, static path (control)
- `GET /api/purge/[variable]` – `revalidatePath('/api/script/<variable>')`
- `GET /api/purge-template` – `revalidatePath('/api/script/[variable]', 'page')`
- `GET /api/purge-static` – `revalidatePath('/api/script')`
- `GET /cached` + `GET /api/purge-cached-page` – ISR page control, proves `revalidatePath` works in the deployment

## Steps
```bash
U=https://<deployment>
curl -sI $U/api/script/test | grep x-vercel-cache   # MISS
curl -sI $U/api/script/test | grep x-vercel-cache   # HIT
curl -s  $U/api/purge/test                          # revalidatePath('/api/script/test')
curl -s -D - $U/api/script/test                     # HIT + stale timestamp  <-- BUG

# control: ISR page IS purged
curl -sI $U/cached | grep x-vercel-cache            # HIT
curl -s  $U/api/purge-cached-page
curl -sI $U/cached | grep x-vercel-cache            # REVALIDATED
```

## Observed (Next 16.3.1)
- `/api/script/test` stays `x-vercel-cache: HIT` with the same body timestamp after
  `revalidatePath('/api/script/test')`, after the `[variable]` template form, and 60s later.
- The static route `/api/script` behaves the same (not purged either).
- `/cached` returns `x-vercel-cache: REVALIDATED` with a fresh timestamp, so `revalidatePath`
  itself is functional in the deployment: only CDN-cached route handler responses are unaffected.
