# Static export + `basePath`: RSC payload `.txt` request 404s at the root path

Reproduction for https://github.com/vercel/next.js/issues/73427 on **Next.js 16.2.2**.

`next build` with `output: 'export'` writes the root route's RSC payload to `out/index.txt`,
but `fetchServerResponse` builds the request URL by appending `.txt` when the pathname does
not end in `/`. With `basePath` and `trailingSlash: false` (the default) the root pathname is
`/next-static-export-404-reproduce`, so the client requests
`/next-static-export-404-reproduce.txt`, which does not exist -> 404, and the client-side
navigation degrades to a full page load.

The Segment Cache prefetches added in 16.2 (`__next._tree.txt`, ...) handle `basePath`
correctly, so the bug is only observable on the legacy `fetchServerResponse` path, which is
still used for navigations that were not prefetched (e.g. `router.push()` from a button).
That is exactly what `app/foo/page.tsx` does.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm run serve &      # static host on http://localhost:3001, GitHub-Pages-like semantics
npm run verify       # Playwright: navigate /foo -> router.push('/'), print all responses
```

`verify.mjs` exits non-zero when a 404 is observed.

## Observed (Next.js 16.2.2)

```
Requests made by router.push("/"):
  404 http://localhost:3001/next-static-export-404-reproduce.txt?_rsc=1n9t9
  200 http://localhost:3001/next-static-export-404-reproduce
  ...
404 requests: 1
  -> http://localhost:3001/next-static-export-404-reproduce.txt?_rsc=1n9t9

Expected file that does exist:      200 /next-static-export-404-reproduce/index.txt
Requested file that does not exist: 404 /next-static-export-404-reproduce.txt
```

## Relevant code

`packages/next/src/client/components/router-reducer/fetch-server-response.ts`

```ts
if (url.pathname.endsWith('/')) {
  url.pathname += 'index.txt'
} else {
  url.pathname += '.txt'   // <- becomes `${basePath}.txt` for the root route
}
```
