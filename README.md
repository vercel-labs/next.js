# Repro: Chained CSS Module `composes` not working with Turbopack (vercel/next.js#85296)

`app/styles.module.scss`:

```scss
.a { text-decoration: underline; }
.b { composes: a; font-style: italic; }
.c { composes: b; font-weight: bold; }
```

## Run

```bash
npm install
npm run dev        # Turbopack, http://localhost:3000
npm run devWebpack # Webpack,   http://localhost:3001
```

The page renders `<p id="target" className={styles.c}>` plus a `<pre>` dump of the
whole `styles` object, so no visual inspection is required.

## Result (next@16.3.1)

| bundler | `styles.c` | computed `text-decoration-line` |
| --- | --- | --- |
| Webpack (`next dev --webpack`) | `c b a` | `underline` |
| Turbopack (`next dev --turbopack`) | `c b` (missing `a`) | `none` |

`styles.b` is correctly `b a` under both bundlers, so only the transitive
(chained) `composes` hop is dropped by Turbopack. Same wrong output with
`next build --turbopack` + `next start`.
