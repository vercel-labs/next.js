# Reproduction for vercel/next.js#54550

`.jsx` import specifiers are not resolved to `.tsx` files (TypeScript `NodeNext`
module resolution writes `./Form.jsx` for `Form.tsx` auto-imports).

## Run

```bash
npm install
npm run build        # Turbopack (default): Module not found: Can't resolve './Form.jsx'
npx next build --webpack
npm run dev          # GET / -> 500 with the same error
```

`app/page.tsx` imports `./AnotherComponent.js` (resolves to `AnotherComponent.tsx`
under Turbopack) and `./Form.jsx` (does NOT resolve to `Form.tsx`).

The `experimental.extensionAlias` workaround from the issue thread fixes the
webpack build but is ignored by Turbopack (it is listed as an unsupported
option in `next/dist/lib/turbopack-warning.js`).
