# Repro: next 16.1.5 emits invalid `@media ... and not (...)` from CSS range syntax

Issue: https://github.com/vercel/next.js/issues/90133

## Run
```
npm install
npm run build
grep -o "@media[^{]*" .next/static/chunks/*.css
```

Input (`app/globals.css`):
```css
@media (width >= 768px) and (width < 1280px) { .d-only-tablet-none { display: none } }
```

Actual built CSS:
```css
@media (min-width:768px) and not (min-width:1280px)
```

Expected:
```css
@media (min-width:768px) and (not (min-width:1280px))
```

Chrome parses the emitted rule as `@media not all`, so the rule never applies
(verified via `document.styleSheets` after `npm start` at a 900px viewport:
`cssText === "@media not all { .d-only-tablet-none { display: none; } }"`,
computed `display: block`).

A `postcss.config.mjs` with only `autoprefixer` is present, matching the report.
