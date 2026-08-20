# Repro: next/font called inside a monorepo workspace package (vercel/next.js#51476)

npm workspaces monorepo:

- `packages/ui` – ESM source package that calls `next/font/google` and exports the result
- `packages/ui-compiled` – the same code as it looks after `tsc` (CJS `require`), i.e. a published/`dist` package
- `apps/web` – Next.js (canary) pages-router app; `/` imports `@repro/ui`, `/compiled` imports `@repro/ui-compiled`

## Run

```bash
npm install
npm run dev --workspace web -- --webpack   # webpack
npm run dev --workspace web                # turbopack
```

Then open http://localhost:3000/ and http://localhost:3000/compiled.

## Observed (next@16.3.1-canary.25)

| package | bundler | transpilePackages | result |
| --- | --- | --- | --- |
| ESM source | webpack | no | 500 `(0 , next_font_google__WEBPACK_IMPORTED_MODULE_0__.Calligraffitti) is not a function` |
| ESM source | webpack | yes | works |
| ESM source | turbopack | no/yes | works |
| compiled CJS | webpack | yes | 500 `(0 , google_1.Calligraffitti) is not a function` |
| compiled CJS | turbopack | yes | 500 `(0 , google_1.Calligraffitti) is not a function` |

The `next/font` call is only rewritten by the font loader when the file is compiled by
Next.js' own transform, and the transform never matches CJS `require("next/font/google")`.
