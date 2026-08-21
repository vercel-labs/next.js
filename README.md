# Repro: redirect / permanentRedirect / notFound inside `generateMetadata` (issue #80879)

Next.js 16.3.1 (also 15.x). Navigation functions called in `generateMetadata` no longer
produce an HTTP response; they degrade to a client-side `<meta http-equiv="refresh">` /
client error boundary, and are dropped entirely when the page component also redirects.

## Run

```bash
npm install
npm run build
npm start
# then, in another shell:
curl -sI http://localhost:3000/metadata-redirect            # 200 (expected 307)
curl -sI http://localhost:3000/metadata-redirect-dynamic    # 200
curl -sI http://localhost:3000/metadata-redirect-sync       # 200
curl -sI http://localhost:3000/metadata-permanent-redirect  # 200 (expected 308)
curl -sI http://localhost:3000/metadata-notfound            # 200 (expected 404)
curl -sI http://localhost:3000/both-redirect                # 307 -> /server-component-redirect (metadata redirect lost)
```

## Observed (next@16.3.1, `next start`)

| route | status | body |
| --- | --- | --- |
| /metadata-redirect | 200 | page `<h1>` rendered + `<meta http-equiv="refresh" content="1;url=/target">` + `data-dgst="NEXT_REDIRECT;replace;/target;307;"` |
| /metadata-redirect-dynamic (force-dynamic) | 200 | same |
| /metadata-redirect-sync (no await) | 200 | same |
| /metadata-permanent-redirect | 200 | `<meta http-equiv="refresh" content="0;url=/target">` |
| /metadata-notfound | 200 | page body + `data-dgst="NEXT_HTTP_ERROR_FALLBACK;404"` |
| /both-redirect (metadata + page both redirect) | 307 | Location: /server-component-redirect — the `generateMetadata` redirect is ignored |

Docs conflict: `generateMetadata` docs say `redirect()`/`notFound()` may be used there,
while the `redirect`/`permanentRedirect` docs omit `generateMetadata`.
