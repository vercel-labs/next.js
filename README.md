# next.js#72846 — CSS module order depends on barrel files + `sideEffects: false`

Minimal pnpm monorepo reproduction for https://github.com/vercel/next.js/issues/72846
(based on the reporter's repo https://github.com/jantimon/reproduction-webpack-css-order, branch `turbo`,
updated to `next@canary`).

## Graph

```
@applications/base/app/page.tsx
  -> @libraries/teaser (barrel: src/index.tsx -> src/teaser.tsx)
       -> @segments/carousel  (barrel: src/index.tsx -> src/buttons.tsx -> button.module.css)
       -> ./teaser.module.css
```

Both `@libraries/teaser` and `@segments/carousel` declare `"sideEffects": false`.
`button.module.css` sets `background-color: #007bff` on `.button`;
`teaser.module.css` sets `background-color: orange` on `.teaserCarouselButton`.
The button element has both classes, so with source import order
(button.module.css first, teaser.module.css last) the button must be **orange**.

## Run

```bash
pnpm install

# webpack production build (bug)
pnpm build:webpack
cat "@applications/base/.next/static/css/"*.css

# turbopack production build (correct)
pnpm build:turbopack
cat "@applications/base/.next/static/chunks/"*.css
```

## Observed (next@16.3.1-canary.24, bundled webpack 5.98.0)

| target | CSS order | computed button background |
| --- | --- | --- |
| `next build --webpack` | teaser.module.css, then button.module.css | `rgb(0, 123, 255)` blue ❌ |
| `next build` (Turbopack) | button.module.css, then teaser.module.css | `rgb(255, 165, 0)` orange ✅ |
| `next dev --turbopack` | button.module.css, then teaser.module.css | orange ✅ |

Turbopack (dev and build) now emits source order; the webpack path still reorders CSS.
Next.js canary bundles webpack `5.98.0`, i.e. it does not yet contain the webpack-side fix
(reported as landed in webpack `5.100.2`).

Removing `"sideEffects": false` from the two packages, or importing
`@segments/carousel/src/buttons` directly instead of through the barrel file,
makes the webpack output correct — showing the order depends on tree shaking of barrel files.
