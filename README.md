# Repro: next 14 CSS minifier merges rules with different nested `@media` (vercel/next.js#91551)

Minimal repro of the CSS minification bug reported with `nextra-theme-docs/style.css`
(`.x\:max-xl\:hidden`, `.x\:max-lg\:block`). No nextra needed: the trigger is plain
nested CSS where sibling rules have identical bodies-shaped nested at-rules.

## Run

```bash
npm install
npm run build
cat out/_next/static/css/*.css
```

## Source (`app/styles.css`)

```css
.x\:max-xl\:hidden { @media (width < 80rem) { display: none; } }
.x\:max-lg\:block  { @media (width < 64rem) { display: block; } }
```

## Actual output with next@14.2.35 (webpack + CssMinimizerPlugin)

```css
.x\:max-lg\:block,.x\:max-xl\:hidden{@media (max-width:63.999rem){display:block}}
```

Both selectors are merged into one rule: `display:none` and the `80rem` breakpoint are
lost, and `.x\:max-xl\:hidden` wrongly gets `display:block` under `max-width:63.999rem`.

## Expected (and what newer versions produce)

| version | output |
| --- | --- |
| 14.2.35 (webpack) | **wrong** – rules merged, declarations lost |
| 15.5.7 (webpack) | correct – `.x\:max-xl\:hidden{@media (max-width:79.999rem){display:none}}.x\:max-lg\:block{@media (max-width:63.999rem){display:block}}` |
| 16.3.1 (`--webpack`) | correct (same as 15) |
| 16.3.1 (turbopack) | correct – `@media not (min-width:80rem){.x\:max-xl\:hidden{display:none}}...` |

Only reproducible on the out-of-support 14.x line.
