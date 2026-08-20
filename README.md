# Repro: issue #21565 — redirects with `i18n` + `basePath`

Next.js 16.3.1 (also reported on 10.x). Config: `basePath: '/my-base-path'`, locales `en`/`es`,
one redirect `{ source: '/', destination: '/my-base-path', basePath: false }`.

## Run

```bash
npm install
npm run dev            # port 3020
# or: npm run build && npm start   # port 3021
for u in / /en /es /en/my-base-path /es/my-base-path /my-base-path; do \
  printf "%-20s " "$u"; curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "http://localhost:3020$u"; done
```

## Observed (identical in dev and `next start`)

| request | status | location |
| --- | --- | --- |
| `/` | 307 | `/my-base-path` (OK) |
| `/en` | 307 | `/my-base-path` (OK) |
| `/es` | 307 | `/es/my-base-path` |
| `/es/my-base-path` | 404 | — |
| `/en/my-base-path` | 404 | — |
| `/my-base-path` | 200 | — |
| `/my-base-path/es` | 200 | — |

For non-default locales the locale prefix is prepended to the redirect destination even though
`basePath: false`, producing `/{locale}/{basePath}` which is never a routable path (the app serves
`/{basePath}/{locale}`), so the redirect dead-ends in a 404.
