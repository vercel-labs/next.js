# Repro: `@import '...' layer(name)` is compiled to invalid `@media layer(name)` (webpack)

Issue: https://github.com/vercel/next.js/issues/55763

## Run

```bash
npm install
# webpack (broken)
npx next dev --webpack       # or: npx next build --webpack && npx next start
# turbopack (works)
npx next build && npx next start
```

Open http://localhost:3000 — the text should be green and bold.

## Result (next@16.3.1-canary.25)

`app/globals.css` has `@import './theme.css' layer(theme);`.

- `--webpack` dev and build emit `@media layer(theme){ .themed{...} }` (invalid CSS),
  so `.themed` computes to `rgb(0, 0, 0) / 400` — no styles applied.
- Turbopack emits correct `@layer theme { .themed{...} }`.
