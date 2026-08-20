# Repro attempt: issue #61371 — "Partial Pre-rendering breaks Intercepted Route"

Minimal reproduction of https://github.com/vercel/next.js/issues/61371, modeled on the
reporter's app shape (root `@modal` slot, `(.)command` interceptor whose non-intercepted
`/command` page calls `redirect("/")`, navigation via `router.push("/command")` and a
prefetched `<Link>`, plus a `(.)photo/[id]` interceptor).

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

Click "link command", press the "open command" button, or click "Open photo 1".
Expected: the intercepted modal (`#modal` / `#full-page` absent) renders above Home.

## Result (2026-08)

PPR (`cacheComponents: true` on `16.3.1-canary.25`, and `experimental.ppr` on the reported
`14.1.1-canary.21`) renders the intercepted route correctly both locally (`next build && next start`)
and when deployed to Vercel. The non-intercepted redirect page is never hit — no reproduction.

To retry the exact reported version: pin `next@14.1.1-canary.21`, `react@18.2.0`,
`react-dom@18.2.0`, replace `next.config.js` with `module.exports = { experimental: { ppr: true } }`,
and make `params`/`searchParams` synchronous objects (Next 14 API).
