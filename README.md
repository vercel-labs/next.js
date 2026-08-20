# Repro: vercel/next.js#14244 — `_app` getInitialProps overrides ISR (ISG) cache-control

Verified on **Next.js 16.3.1**, Node 24.

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3020

# ISR page on a cache MISS (fallback: 'blocking'):
curl -sI http://localhost:3020/b/one   # <-- Cache-Control comes from _app
curl -sI http://localhost:3020/b/one   # <-- second (STALE) hit uses ISR cache-control
```

## Expected

Headers set in `pages/_app.js` `getInitialProps` must never win over the
ISR/`revalidate` `Cache-Control` of a `getStaticProps` page.

## Actual (Next 16.3.1)

First (MISS) request for `/b/[slug]`:

```
HTTP/1.1 200 OK
x-test: test-value
Cache-Control: private, max-age=999      <-- set by _app, ISR value lost
x-nextjs-cache: MISS
```

Subsequent (STALE / background revalidation) requests are correct:

```
Cache-Control: s-maxage=1, stale-while-revalidate=31535999
```

So on a cache MISS the custom `_app` headers (including `Cache-Control`) leak into
the response that a CDN will cache, replacing the ISR cache-control.

The original `ERR_HTTP_HEADERS_SENT` crash reported in the issue (reproducible on
next@10.0.2-canary.3 with the reporter's repo) no longer happens: background
revalidation now renders with a mocked response.
