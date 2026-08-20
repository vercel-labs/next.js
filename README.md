# Reproduction for vercel/next.js#45607

"Bundle size of pages/_app seems to be added to api routes and edge functions."

`pages/_app.js` imports heavy client deps (lodash, date-fns, @tanstack/react-query).
`pages/api/og/generate.js` is an `edge` runtime API route, `pages/api/node.js` a node one.
Neither API route imports anything from `_app`.

## Run

```bash
pnpm install
pnpm build            # Next 16 canary (Turbopack)
pnpm build:webpack    # Next 16 canary (webpack)
```

To see the original symptom, pin Next 15 (or 13) and rebuild:

```bash
pnpm add next@15.5.23 react@19.1.0 react-dom@19.1.0 && pnpm build
```

## Observed

Next 15.5.23 / 13.5.11 build summary attributes the shared `_app` chunk to API routes:

```
├ ƒ /api/node                                  0 B         146 kB
└ ƒ /api/og/generate                           0 B         146 kB
+ First Load JS shared by all               146 kB
  ├ chunks/pages/_app-1fa4a718ea873256.js  50.5 kB
```

But the emitted server bundle for the edge route does NOT contain the `_app`
dependencies (`grep -c "date-fns\|tanstack\|lodash" .next/server/pages/api/og/generate.js` -> 0),
so it is a build-summary reporting problem, not real edge function bloat.

Next 16.3.1-canary.25 no longer prints a Size / First Load JS column at all, and the
edge chunks listed in `.next/server/middleware-manifest.json` (~137 kB total) contain
none of the `_app` dependencies.
