# Repro: middleware (`proxy.ts`) rewrite to a Pages Router API route serves the prerendered i18n 404 on Vercel (next 16.2.x)

Upstream issue: https://github.com/vercel/next.js/issues/92114

Pages Router + legacy `i18n` + `proxy.ts` middleware that rewrites `/v1/:path` to
`/api/trpc/:path`. On Vercel, next `16.2.x` never invokes the API function: the
request is answered with the prerendered localized 404 (`x-matched-path: /pt-BR/404`)
and is then served from the Full Route Cache (`x-vercel-cache: HIT`), so query-string
cache busting does not help. Next `16.1.7` answers the same request with the API JSON.

## Run

```bash
npm install
npm run build && npm start   # local: rewrite reaches the tRPC handler (no 404)
```

Vercel (where it fails) — deploy this directory, then:

```bash
Q='?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22name%22%3A%22world%22%7D%7D%7D'
curl -sD - "https://<deployment>/api/trpc/hello$Q" -o /dev/null   # 200, x-matched-path: /api/trpc/[trpc]
curl -sD - "https://<deployment>/v1/hello$Q"                      # BUG: 404 HTML, x-matched-path: /pt-BR/404
```

## Observed matrix (identical source, only `next` version / `i18n` changed)

| variant | `GET /v1/hello` on Vercel |
| --- | --- |
| next 16.1.7 + i18n | 200 JSON, `x-matched-path: /api/trpc/[trpc]` |
| next 16.2.1 + i18n | 404 HTML, `x-matched-path: /pt-BR/404`, `x-vercel-cache: HIT` |
| next 16.2.9 + i18n | 404 HTML, `x-matched-path: /pt-BR/404`, `x-vercel-cache: HIT` |
| next 16.2.1, `i18n` removed | 200 JSON, `x-matched-path: /api/trpc/[trpc]` |

Notes:
- All unmatched paths share a single `/pt-BR/404` Full Route Cache entry (identical `age`
  across distinct request paths), which explains the sticky, cache-busting-proof 404.
- `next build && next start` locally reaches the API handler, so the divergence is in the
  Vercel routing/build-output layer for 16.2.x with legacy i18n.
