# Repro: next#49596 — layout/template tree does not match docs

Docs claim a layout renders `<Layout><Template key={routeParam}>{children}</Template></Layout>`,
but Next.js inserts `OuterLayoutRouter` between the layout and the keyed template subtree,
so the layout's direct child has `key=null` and never changes per route.

## Run

```bash
npm install
npm run dev            # terminal 1
node check.mjs         # terminal 2 (Playwright; run `npx playwright install chromium` first)
```

`check.mjs` loads `/a`, client-navigates to `/b`, and walks the React fiber chain from the
`template.tsx` DOM node up to the layout's direct child (`LayoutChildMarker`).

## Observed (next@16.3.1-canary.25)

```
serverInspect: "root-layout-child: <Symbol(react.client.reference)> key=null"
fiberChainTemplateToLayout: [
  "<div> key=null",
  "<SegmentViewNode> key=null",
  "<TemplateContext> key=\"a\"",     // "b" after navigation
  "<[object Object]> key=\"0\"",
  "<SegmentStateProvider> key=\"a\"",
  "<OuterLayoutRouter> key=null",
  "<LayoutChildMarker> key=null"
]
```

The route-specific key lives *inside* `OuterLayoutRouter`, not on the layout's direct child,
so `AnimatePresence`-style components placed in a layout never see a key change.
