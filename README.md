# Repro: next.js#48759 — kebab-case CSS Module class names are not exposed as camelCase

Next.js CSS Modules export only the literal class name, so `styles.largeDescription`
for `.large-description` is `undefined` (silently renders no class). There is no
`exportLocalsConvention` / camelCase option in `next.config.js`, and no Turbopack workaround.

## Run

```
npm install
npm run dev        # Turbopack (default)
# or: npx next dev --webpack
open http://localhost:3000
```

## Observed (Next 16.3.1-canary.25, both Turbopack and webpack)

```html
<div id="a" class="page-module__E0kJGG__description">description</div>
<div id="b">styles.largeDescription (camelCase -> undefined)</div>
<div id="c" class="page-module__E0kJGG__large-description">styles['large-description'] (works)</div>
<pre id="keys">{"description":"...","large-description":"..."}</pre>
```

Expected by reporter: a camelCase alias (or at least a warning) for dashed class names.
