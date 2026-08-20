# Repro: `next/font` does not work in custom `pages/_document`

Issue: https://github.com/vercel/next.js/issues/44840

## Steps
```
npm install
npm run build   # or: npm run dev  then open http://localhost:3000
```

## Expected
The font class/CSS variable applied to `<Html>` in `pages/_document.js` produces a
`@font-face` + `--font-inter` definition, so the font applies to the root html element.

## Actual (next@16.3.1-canary.25)
`next build` fails:

```
./_document.js
Error: next/font: error:
Cannot be used within _document.js
```

`next dev` returns HTTP 500 for `/` with the same error.
The same font loader in `pages/_app.js` builds fine and emits `--font-inter: "Inter", "Inter Fallback"`,
so the limitation is specific to `pages/_document`.
