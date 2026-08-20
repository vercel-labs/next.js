# Repro: issue #59521 — `<Suspense>` in root layout breaks `notFound()` / `redirect()` status codes

Next.js `16.3.1-canary.25` (App Router, Turbopack build).

## Run

```bash
npm install
npm run build
npm start
# with Suspense in the root layout (this app):
curl -I http://localhost:3000/gone      # => 200 OK   (expected 404)
curl -I http://localhost:3000/redirect  # => 200 OK   (expected 307 + location: /)
```

Remove the `<Suspense>` wrapper around `{children}` in `app/layout.tsx` (see
`app/layout.control.tsx.txt`), rebuild, and the same routes return `404` and
`307 location: /`.

## Observed

With the boundary in place the responses are the prerendered fallback HTML
(`loading...`) with status `200`; the `NEXT_REDIRECT;replace;/;307;` /
not-found signal is streamed into the RSC payload and only handled on the
client, so the correct HTTP status is never sent.
