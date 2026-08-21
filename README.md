# Repro: misleading "should be wrapped in a suspense boundary" error (vercel/next.js#85951)

Minimal reproduction: with `cacheComponents: true`, a root layout that does **not**
render `<html>`/`<body>` makes `next build` fail on any page that reads
`useSearchParams()` in a client component, with a misleading error that says the
component needs a Suspense boundary — even though the boundary is already there.

next-auth / proxy.ts / multi-tenant rewrites from the original report are **not** required.

## Run

```bash
npm install
npx next build --debug-prerender
```

## Observed (next@16.0.2-canary.12, reporter's version)

```
⨯ Render in Browser should be wrapped in a suspense boundary at page "/search".
  Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
Error occurred prerendering page "/search".
```

## Observed (next@16.3.1-canary.26, pinned here)

Even worse — no reason at all is printed, also with `--debug-prerender`:

```
Error occurred prerendering page "/search".
Export encountered an error on /search/page: /search, exiting the build.
```

## Expected

The error should say that the root layout for this route is missing `<html>`/`<body>`.

## Controls

- Add `<html><body>` to `app/layout.tsx` -> build succeeds.
- Remove `cacheComponents: true` from `next.config.mjs` (keep the layout as-is) -> build succeeds.
