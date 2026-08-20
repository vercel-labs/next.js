# Reproduction for vercel/next.js#58728

`src/pages` is not ignored when a root `app` directory exists.

## Run

```bash
npm install
npm run build
```

## Expected

Per the docs ("`src/app` or `src/pages` will be ignored if `app` or `pages` are
present in the root directory"), the build should succeed and `src/pages/TestPage.tsx`
should be ignored.

## Actual

- next@14.0.4-canary.6 (reporter's version):
  `Build optimization failed: found page without a React Component as default export in pages/TestPage`
- next@16.3.1-canary.25 (webpack and Turbopack):
  `Error: > \`pages\` and \`app\` directories should be under the same folder`
