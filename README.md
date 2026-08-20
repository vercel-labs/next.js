# Repro: import alias fails in a route directory whose name starts with a period

Issue: https://github.com/vercel/next.js/issues/69068 (verified on next@16.3.1)

`src/app/.well-known/route.ts` imports `~/constants`, exactly like `src/app/page.tsx` does.
The TypeScript language server (what your editor runs) reports
`TS2307 Cannot find module '~/constants'` only in the dot-prefixed directory: tsconfig's
`**/*.ts` include glob never matches hidden (dot-prefixed) directories, so that file ends up
in an *inferred* project with no `paths` mapping and shows a red squiggly.

`next build` succeeds and even type-checks the file correctly (add a real type error and the
build fails), so the failure is editor-only — a confusing mismatch.

## Run

```bash
npm install
npm run repro    # language-server diagnostics for both files; exits 1 when reproduced
npm run build    # succeeds, showing the mismatch with the editor error
```

Expected `npm run repro` output:

```
src/app/page.tsx
  project: <cwd>/tsconfig.json
  diagnostics: none

src/app/.well-known/route.ts
  project: /dev/null/inferredProject1*
  TS2307 at 5:32 - Cannot find module '~/constants' or its corresponding type declarations.
```

Workaround (from the issue thread): add the directory to `include`, e.g.
`"src/app/.well-known/**/*"`.
