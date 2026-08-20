# Repro: next writes a new `[distDir]/types/**/*.ts` include on every run (vercel/next.js#55249)

`distDir` is dynamic (`dist/build/$GIT_SHA`). `tsconfig.json` already includes
`dist/build/**/*.ts`, which covers every generated type file, but Next.js still
appends `<distDir>/types/**/*.ts` because the check is a plain string comparison
(`userTsConfig.include.includes(type)` in
`packages/next/src/lib/typescript/writeConfigurationDefaults.ts`).

## Run

```bash
npm install
GIT_SHA=aaa1 npx next build
GIT_SHA=bbb2 npx next build
git diff tsconfig.json
```

## Observed (next@16.3.1-canary.25)

Each build rewrites `tsconfig.json` and appends two more globs:

```
- include was updated to add 'dist/build/aaa1/types/**/*.ts'
- include was updated to add 'dist/build/aaa1/dev/types/**/*.ts'
- include was updated to add 'dist/build/bbb2/types/**/*.ts'
- include was updated to add 'dist/build/bbb2/dev/types/**/*.ts'
```

`include` grows without bound. Expected: no change, since the existing glob
already matches. (`next lint` from the original report was removed in Next.js 16;
`next build`/`next dev` run the same `writeConfigurationDefaults` code path.)
