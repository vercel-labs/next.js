# Repro for vercel/next.js#64960 — `axes` with variable fonts in `next/font/google`

Question in the issue: how do you set a *value* for a variable-font axis (e.g. `wdth`) via `next/font/google`?

Run:

```bash
npm install
npm run dev   # then open /axes and /no-axes
node measure.mjs   # measures rendered text width per case
```

Findings observed with Next.js 16.3.1 (same API since 13.x):

- `axes` is typed as a list of axis **tags** only. For `Bricolage_Grotesque` the type is
  `("opsz" | "wdth")[]`; `axes: { wdth: 80.7 }` is a TS error (see `axes-value-attempt.ts.txt`).
- Listing an axis widens the generated `@font-face`: `font-stretch: 75% 100%` with `axes: ['wdth']`
  vs `font-stretch: 100%` without it. The value is then chosen in CSS
  (`font-variation-settings` / `font-stretch`), not in the loader.
- Measured text width of "Hamburgefonstiv" at 40px:
  | case | with `axes: ['wdth']` | without `axes` |
  |---|---|---|
  | no override | 323px | 323px |
  | `font-variation-settings: "wdth" 80.7` | **262px** | 323px (no effect) |
  | `font-variation-settings: "wdth" 200` | 323px (clamped to axis max) | 323px |
  | `font-stretch: 75%` | **240px** | 323px (no effect) |
- Loading the same Google font twice in one document (once with `axes`, once without) emits the same
  `font-family: "Bricolage Grotesque"` for both, so the `@font-face` rules collide and
  `font-variation-settings` silently stops working. Keep one instantiation per family.
