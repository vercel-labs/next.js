# Repro: `Missing <html> and <body> tags in the root layout` on 404 with multiple root layouts

Upstream issue: https://github.com/vercel/next.js/issues/82446

## Run

```bash
npm install
npm run dev   # http://localhost:3010
```

Then open `http://localhost:3010/test/does-not-exist` (or click the link on
`http://localhost:3010/test`).

## Tree

```
src/app
├── layout.tsx          # pass-through root layout (no <html>/<body>) -> multiple root layouts
├── (others)
│   ├── layout.tsx      # root layout with <html>/<body>
│   └── page.tsx
└── [locale]
    ├── layout.tsx      # root layout with <html>/<body>
    └── page.tsx
```

## Expected

A 404 for an unmatched path renders the built-in not-found page without a dev
runtime error, since every routable segment is covered by a layout that renders
`<html>`/`<body>`.

## Actual (`next dev`)

The page shows the built-in `404 This page could not be found.` and the dev
overlay reports:

```
Runtime Error
Missing <html> and <body> tags in the root layout.
Read more at https://nextjs.org/docs/messages/missing-root-layout-tags
```

Reproduced with next@15.4.6 (webpack) and next@16.3.1-canary.26 (turbopack).

## Notes

* Adding `src/app/global-not-found.tsx` that renders `<html>`/`<body>` makes the
  error go away.
* Removing the pass-through `src/app/layout.tsx` also makes the error go away.
