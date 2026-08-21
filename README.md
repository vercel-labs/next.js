# Turbopack: matching loaders on resource queries (`condition.query`)

Reproduction for https://github.com/vercel/next.js/issues/90560 (docs request for
`turbopack.rules.*.condition.query`, added in Next.js 16.2 by
https://github.com/vercel/next.js/pull/88644).

```bash
npm install
npm run dev          # Turbopack, with condition.query rules  -> works
npm run dev:webpack  # Webpack, with resourceQuery rules       -> works
```

To see the failures, empty out `next.config.mjs` (`export default {}`) and run each
command again:

* Turbopack: `./data/sample.txt` → `Error: Unknown module type`
* Webpack:   `./data/sample.txt?raw` → `Module parse failed: Unexpected token (1:6) …
  You may need an appropriate loader to handle this file type`

i.e. neither bundler handles `?raw` automatically in a Next.js app; both need an
explicit rule. `condition.query` is the Turbopack counterpart of webpack's
`resourceQuery`.
