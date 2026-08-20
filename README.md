# Repro: `${configDir}` in tsconfig `compilerOptions.paths` breaks module resolution

Issue: https://github.com/vercel/next.js/issues/70912

## Steps

```bash
npm install
npx tsc --noEmit   # passes -> TypeScript resolves the alias fine
npm run build      # fails: Module not found: Can't resolve '@/components/hello'
npm run dev        # http://localhost:3000 -> 500, same error
```

`tsconfig.base.json` uses the TS 5.5 `${configDir}` template variable:

```json
{ "compilerOptions": { "baseUrl": "${configDir}", "paths": { "@/*": ["${configDir}/src/*"] } } }
```

Next.js copies `compilerOptions.paths` verbatim (see
`next/dist/lib/typescript/loadTsConfig.js`, which only substitutes `${configDir}`
for `baseUrl`), so the alias becomes the literal
`./${configDir}/src/components/hello`.

Observed with next@16.3.1 / typescript@5.9.3 on both Turbopack and `--webpack`.
