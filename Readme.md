# Repro: next build (webpack) fails when CSS contains an escaped space

Issue: https://github.com/vercel/next.js/issues/76269

```
npm install
npm run build       # next build --webpack -> fails
npm run build:turbopack  # passes
```

`app/global.css` contains:

```css
[data-attr=\ ] {
  color: red;
}
```

Webpack build fails in `Compilation.hooks.processAssets` with
`TypeError: Cannot read properties of undefined (reading '0')` thrown from
`Parser.attribute` inside `next/dist/compiled/cssnano-simple` (generateUniqueSelector).

Confirmed failing with next@15.2.0-canary.66 (`next build`) and next@16.3.1-canary.26
(`next build --webpack`). Turbopack builds succeed.
