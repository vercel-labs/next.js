# Repro: Navigation breaks CSS Module precedence (vercel/next.js#75525)

Minimal reproduction of https://github.com/vercel/next.js/issues/75525.
The reporter's StackBlitz cannot be run headlessly, so this is a self-contained equivalent.

## Setup

```bash
npm install
npx playwright install chromium   # only needed for the automated check
```

## Reproduce (dev)

```bash
npm run dev            # Turbopack (default)
# or: npm run dev:webpack
npm run check          # scripted navigation check against http://localhost:3000
```

Steps performed by `check.mjs` (also reproducible by hand):

1. Open `/` — `#square` is **blue** (`app/page.module.css` wins; it is imported after `app/card.tsx`).
2. Click "other" — `/other` square is **red** (only `app/card.module.css` applies). Correct.
3. Click "home" — square is **still red**. Expected blue. BUG
4. Hard reload `/` — blue again.

Visible in the DOM: after the client navigation the dev-mode stylesheet `<link>`
for `app/other/page` is appended *after* the one for `app/page`, so
`card.module.css` (red) ends up later in the cascade and overrides the
equal-specificity rule from `page.module.css` (blue).

`next build && next start` is not affected (single merged CSS file, correct order).
