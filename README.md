# Repro: `next build` does not typecheck test files (vercel/next.js#56333)

`app/__tests__/example.test.ts` contains `export const broken: number = 'this is not a number'`.

## Steps

```bash
npm install
npx next build
```

## Observed

* `next@15.5.7` (and any version using the TypeScript-API checker): build **succeeds**, the type error is
  never reported. `npx tsc --noEmit` reports it (`TS2322`, exit 2).
  Cause: `packages/next/src/lib/typescript/runTypeCheck.ts` filters diagnostics from
  `**/__(tests|mocks)__/**` and `**/*.(spec|test).*`.
* `next@canary` (16.3.1-canary.25): build **fails** with
  `app/__tests__/example.test.ts(2,14): error TS2322` because `experimental.useTypeScriptCli`
  now defaults to `true` and delegates to `tsc`, which checks the whole project.
* Setting `experimental: { useTypeScriptCli: false }` in `next.config.ts` (as committed here)
  restores the reported bug on canary: `next build` exits 0 with the type error unreported.

Delete `next.config.ts` (or set the flag to `true`) to see the fixed canary behaviour.
