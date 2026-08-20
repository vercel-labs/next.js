# Repro: vercel/next.js#25456 — CSS module rules duplicated (shared component / `next/dynamic`)

The reporter never published a repro. This is a minimal one.

`components/Text.js` imports `Text.module.css` and is shared by `/`, `/a`, `/b` and by
`components/DynamicChild.js`, which `/` loads through `next/dynamic`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev:webpack           # next dev --webpack on :3001
node nav.mjs http://localhost:3001   # loads /, then client-side navigates a -> b -> / -> a -> b
```

`nav.mjs` counts, at each step, how many live CSSOM rules contain `font-size: 20px`
(the only declaration in `Text.module.css`).

## Observed (Next.js 16.3.1 and 14.2.3, webpack dev)

```
initial load /: 1 matching rule(s)
click -> /a:    2 matching rule(s)   (app/page.css + app/a/page.css, identical rule)
click -> /b:    3 matching rule(s)   (+ app/b/page.css)
```

Every client-side navigation appends another `<link>` whose stylesheet repeats the very
same `.Text_text__xxxxx { color: rebeccapurple; font-size: 20px }` rule, so the last
route visited wins on equal specificity — the specificity/order breakage described in the issue.

## Not reproducible in

- `next dev` with Turbopack (default in 16.x): stays at 1 rule through all navigations.
- `next build` (Turbopack and `--webpack`, 16.3.1 and 14.2.3): a single CSS file holds
  the rule once and every route links to it, including the `next/dynamic` (`ssr: false`) route.
