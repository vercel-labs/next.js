# Issue 32645 — CSS `@import` is emitted at the end of the bundled stylesheet (and therefore ignored)

`app/globals.css` contains a rule followed by an `@import url(...)`, which older Next.js
(babel/webpack 4 pipeline) split into its own `<style>` tag. Today the `@import` is kept in
place / appended after other rules of the concatenated bundle, which is invalid CSS, so the
browser silently discards it and the font is never requested.

## Steps

```bash
npm install
npm run build   # next build --webpack
npm start       # open http://localhost:3000
```

### Observed (Next 16.3.1 webpack and Next 15.2.5)

`.next/static/css/*.css` ends with:

```
...h1{font-family:Abril Fatface}@import url("https://fonts.googleapis.com/css2?family=Abril+Fatface&display=block");
```

In the browser: `document.styleSheets[0]` contains **0** `CSSImportRule` and **no** request is
made to `fonts.googleapis.com`. Same with `npm run dev`.

### Expected

The `@import` is hoisted to the top of the emitted stylesheet (or emitted in its own tag) so it
is honoured.

### Notes

* `npm run build:turbopack` (default `next build` in 16) fails hard instead:
  `Parsing CSS source code failed — @import rules must precede all rules aside from @charset and @layer statements`.
* When the `@import` is the first statement in `globals.css`, both bundlers hoist it correctly —
  which is why the reported workarounds (moving imports to the top / into a dedicated file) work.
