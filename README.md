# Issue 58094 — custom `cacheHandler` fails to serve pre-rendered pages (App Router)

Reproduction of https://github.com/vercel/next.js/issues/58094 on `next@16.3.1-canary.25`.

## Run

```sh
npm install
npm run build
NEXT_PRIVATE_DEBUG_CACHE=1 npm run start
curl -i http://localhost:3000/blog/should-work
```

## Expected

HTTP 200 with the pre-rendered page (`/blog/should-work` is listed as `●  (SSG)` in the build output).

## Actual

HTTP 404 (the built-in 404 page) and the server logs:

```
IncrementalCache: using custom cache handler CacheHandler
Error: Internal: NoFallbackError
```

The build writes the pre-rendered page only to `.next/server/app/`; it never calls
`cacheHandler.set()`, so after the server restarts the custom (in-memory) handler is empty.
Because the custom handler replaces `FileSystemCache`, the on-disk prerender is invisible and
`dynamicParams = false` makes the miss fatal → 404.

Removing `cacheHandler` from `next.config.js` (default filesystem cache) returns 200,
confirming the custom handler is the cause.

Note: the original Pages Router reproduction (`getStaticProps` + `fallback: false`) now returns
200 on this canary; the failure remains in the App Router.
