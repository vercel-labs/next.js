# Reproduction for vercel/next.js#46678

`dynamic(() => import("./Button.js"))` (fully specified ESM specifier under
TypeScript `"module": "node16"`, resolving `Button.tsx`) fails to resolve.

## Run

```bash
npm install
npm run dev          # Turbopack: GET / -> 500 "Module not found: Can't resolve './Button.js'"
npx next dev --webpack # webpack: same error
```

- `/` uses a dynamic import of `./Button.js`
- `/static` uses a static import of `./Button.js` (fails too)

Uncommenting `experimental.extensionAlias` in `next.config.mjs` fixes the
webpack build (200 OK) but Turbopack still fails and warns the option is
unsupported.
