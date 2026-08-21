# Repro for vercel/next.js#83099 — `redirect()` JSDoc omits Client Components

The website docs say `redirect()` works in Server and Client Components, Route Handlers and
Server Actions, but the JSDoc in `packages/next/src/client/components/redirect.ts` (and for
`permanentRedirect`) only lists Server Components, Route Handlers and Server Actions, and links
to old `building-your-application/*` doc URLs.

This app demonstrates the website is correct: `redirect()` called from a Client Component works.

```
npm install
npm run dev
# initial request: 307 -> /target
curl -i http://localhost:3000/client
# client-side navigation: / -> click link -> ends at /target
node check.mjs
```

Verified on Next.js 16.3.1-canary.26: `curl -i /client` returns
`HTTP/1.1 307 Temporary Redirect` with `location: /target`, and the Playwright script prints
`final url: http://localhost:3000/target`.

Fix needed: mention Client Components and update doc links in the JSDoc of `redirect` and
`permanentRedirect`.
