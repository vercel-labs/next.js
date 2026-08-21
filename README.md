# Repro: next.js #82000 — CSS still processed as a stylesheet when imported via `!!raw-loader!`

Issue: https://github.com/vercel/next.js/issues/82000

## Run

```bash
npm install
npm run dev   # http://localhost:3000
# or
npm run build
```

## Expected

`import fooRaw from '!!raw-loader!./foo.css'` should only return the file source.
The leading `!!` should disable all configured loaders/rules for that request, so no
CSS chunk should be emitted and `body` should keep the default background.

## Actual (next 15.4.2 and 16.3.1-canary.26, webpack)

`fooRaw` contains the source AND Next also emits a real stylesheet:

- dev HTML: `<link rel="stylesheet" href="/_next/static/css/app/page.css?v=...">`
  whose contents show Next's own CSS pipeline ran on the file:
  `css ./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[13].oneOf[10].use[2]!...postcss-loader...!./app/foo.css`
- `next build`: `.next/static/css/<hash>.css` => `body{background:rgb(255,0,0)}` and the
  prerendered `index.html` links it.
- Browser: `getComputedStyle(document.body).backgroundColor === 'rgb(255, 0, 0)'`.

Note: with Turbopack the same import fails to resolve entirely
(`Module not found: Can't resolve '!!raw-loader!./foo.css'`), so inline loader syntax
is unsupported there.
