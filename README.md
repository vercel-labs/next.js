# Repro: issue #63483 — `force-static` dynamic route caches every `notFound()` result

Minimal reproduction (based on the reporter's repo, updated for async `params`).

`app/params/[id]/page.tsx` uses `export const dynamic = 'force-static'` and calls
`notFound()` for non-numeric ids.

## Steps

```bash
npm install
npm run build
npm start
curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/params/aa   # 404
curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/params/bb   # 404
ls .next/server/app/params/                                          # aa.*, bb.* cache entries
cat .next/server/app/params/aa.meta                                  # {"status":404,...}
```

Each unique 404 param writes a new `.html`/`.rsc`/`.meta`/`.segments` cache entry;
refreshing returns the same cached timestamp. Unbounded growth for arbitrary URLs.
