# Repro attempt for vercel/next.js#77178 — `loadEnvConfig` only works on canary

Reporter's claim: `loadEnvConfig(process.cwd()).loadedEnvFiles` is `[]` on `next@15.2.2`
but populated on `next@15.2.2-canary.7` / `next@15.3.0-canary.10`.

## Run

```bash
npm install            # next@15.2.2 (stable, the "broken" version per the report)
npx next dev           # or: npm run dev
```

`next.config.ts` calls `loadEnvConfig(process.cwd())` and logs `loadedEnvFiles`.
`./verify.sh` repeats the same check on 15.2.2, 15.2.2-canary.7 and 15.3.0-canary.10.

## Result (Node 24, npm, Linux)

All three versions print the same, populated array:

```
REPRO loadedEnvFiles: [
  {
    path: '.env',
    contents: 'NEXT_PUBLIC_API_URL=https://example.com/api\n',
    env: { NEXT_PUBLIC_API_URL: 'https://example.com/api' }
  }
]
```

So the reported stable-vs-canary difference does not reproduce. `packages/next-env/index.ts`
is byte-identical between tags `v15.2.2` and `v15.2.2-canary.7`.

`loadedEnvFiles: []` is reproducible only when no `.env*` file exists in the directory
passed to `loadEnvConfig` (delete `.env` here and re-run to see `REPRO loadedEnvFiles: []`),
which suggests the reporter's stable CodeSandbox simply did not contain the `.env` file
(CodeSandbox does not persist dotfiles the same way across sandboxes).
