# Reproduction for vercel/next.js#64864

`/manifest.webmanifest` (app-router metadata route) is served with
`cache-control: public, max-age=0, must-revalidate` and **no** `ETag`/`Last-Modified`,
and the `<link rel="manifest">` href has no content hash. The browser therefore
re-requests (and fully re-downloads, since a 304 is impossible) the manifest on
every page load / client navigation.

## Run

```bash
npm install
npm run build
npm start &        # http://localhost:3000
npm run check      # prints the manifest link + response headers
```

Also reproducible in `npm run dev`.

## Observed (next@canary 16.3.1-canary.25 and next@14.2.2, `next start`)

```
<link rel="manifest"> in HTML: <link rel="manifest" href="/manifest.webmanifest"/>
status: 200
cache-control: public, max-age=0, must-revalidate
etag: null
last-modified: null
conditional request status (expected 304 if revalidation worked): 200
```

## Expected (per issue)

Hashed, immutable URL, e.g. `<link rel="manifest" href="/manifest.webmanifest?<hash>">`
with `cache-control: public, max-age=31536000, immutable` — or at minimum a validator
(`ETag`) so revalidation returns 304.

## Note

The secondary report of *duplicate* `cache-control` headers when overriding via
`next.config` `headers()` is no longer reproducible on canary (verified: exactly one
`cache-control: public, max-age=3600` header).
