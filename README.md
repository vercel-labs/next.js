# Repro: Turbopack does not expand `${configDir}` in an extended tsconfig

Upstream issue: https://github.com/vercel/next.js/issues/86143

`config/tsconfig-base.json` sets `"baseUrl": "${configDir}/src"` (TypeScript 5.5+ template variable)
and `tsconfig.json` extends it. `tsc --noEmit` resolves `@/components/Center` fine; Turbopack does not.

## Run

```bash
npm install
npx next build          # FAILS: Module not found '@/components/Center'
npx next build --webpack # PASSES
```

Turbopack error:

```
Module not found: Can't resolve '@/components/Center'
Import map: aliased to relative './components/Center' inside of [project]/config/${configDir}/src
```

Reproduced with next 16.0.3 and 16.3.1-canary.26.
