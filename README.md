# Repro: next#91984 — bundled mini-css-extract-plugin ignores `matchResource` (`!=!`)

Next.js bundles mini-css-extract-plugin v2.4.4, whose loader calls
`this.importModule(`${this.resourcePath}.webpack[javascript/auto]!=!!!${request}`)`.
Because `this.resourcePath` is used instead of `this._module.matchResource`, every CSS
`url()` dependency inside a module imported through `matchResource` (`!=!`) sees an
issuer of `<original file>.webpack[javascript/auto]` instead of the `.css` matchResource.
Next's webpack rules are issuer-based, so the asset is handled by `next-image-loader`
(JS object) instead of `asset/resource`.

Fixed upstream in mini-css-extract-plugin v2.10.2 (webpack/mini-css-extract-plugin#1162).

## Files

- `raw/source.txt` – CSS source with `background-image: url(./icon.png)`
- `app/page.js` – `import "../styles/virtual.css!=!../raw/source.txt"` (matchResource `.css`)

## Run

```bash
npm install
npm run build
cat .next/static/css/*.css
```

## Observed (Next 16.3.1-canary.26, bundled MCEP 2.4.4)

```
body{background-image:url([object Object])}
```

## Expected (patch `next/dist/compiled/mini-css-extract-plugin/loader.js` to use
`this._module.matchResource || this.resourcePath`)

```
body{background-image:url(/_next/static/media/icon.<hash>.png)}
```

## Variant

If the matchResource path lives in a different directory than the real resource
(e.g. `styles/virtual.css!=!raw/source.txt` with `icon.png` next to `virtual.css`),
the build fails with `Module not found: Can't resolve './icon.png'` — url() is
resolved against the real resource's directory. That part is *not* fixed by the
upstream patch (webpack derives module context from `resource`, not `matchResource`).
