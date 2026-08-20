# Repro: Next.js rewrites tsconfig.json with invalid/irrelevant options (vercel/next.js#45617)

```bash
npm install
cp tsconfig.json tsconfig.original.json   # keep a copy
npx next build
git diff -- tsconfig.json                 # see what Next.js rewrote
```

`package.json` has `"type": "module"`. `tsconfig.json` only sets
`exactOptionalPropertyTypes`, `target`, `noEmit` and `jsx: "preserve"`, relying on
TypeScript 7 defaults (`strict: true`, `module`/`moduleResolution`, `esModuleInterop`,
`isolatedModules`).

Observed with next@canary + typescript 7.0.2:

* Next.js injects 12 options into `tsconfig.json`, including `strict: false`,
  which makes the build fail:
  `error TS5052: Option 'exactOptionalPropertyTypes' cannot be specified without specifying option 'strictNullChecks'.`
* The explicit user value `jsx: "preserve"` is overwritten with `react-jsx`.
* Options that are already TypeScript defaults are still written:
  `module`, `esModuleInterop`, `isolatedModules`, `exclude: ["node_modules"]`, `lib`, `allowJs`.
* There is no flag to opt out of the rewrite.
