# Repro: vercel/next.js#82170 — Turbopack `padding-inline-start` transpiled with higher specificity

Global CSS `ul { padding-inline-start: 20px }` + legacy browserslist targets.

```
pnpm install
pnpm dev:turbo    # http://localhost:3001 -> /_next/static/chunks/app_globals_*.css
pnpm dev:webpack  # http://localhost:3002 -> /_next/static/css/app/layout.css
```

Turbopack (Lightning CSS) output:

```css
ul:not(:-webkit-any(:lang(ae), :lang(ar), ... )) { padding-left: 20px; }
ul:-webkit-any(:lang(ae), ... ) { padding-right: 20px; }
```

Webpack (postcss) output:

```css
ul { -webkit-padding-start: 20px; padding-inline-start: 20px; }
```

Turbopack's selectors gain extra specificity (`:not(...)`/`:is(...)`), so unrelated
overrides that used to win now lose. Upstream: parcel-bundler/lightningcss#1018.
