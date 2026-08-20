# Repro: `.env` beats `.env.local` when the parent process already exported the value (next.js#17338)

Next.js 16.3.1 / Node 24. `next dev` never overrides a variable that is already
present in `process.env`, which is exactly the situation created by `vercel dev`
(and Vercel deployments): the Vercel CLI loads `.env` / dashboard variables into
`process.env` itself and then spawns `next dev`. The docs claim
"`.env.local` always overrides the defaults set".

Both `.env` and `.env.local` define `TEST` / `NEXT_PUBLIC_TEST`.

## Run

```bash
npm install
npm run verify   # exits 1 while the bug is present
```

`verify.mjs` starts two dev servers and reads `/api/env`:

| case | how `next dev` is started | `TEST` |
| --- | --- | --- |
| A | plain `next dev` | `from-dot-env-local` (documented) |
| B | `next dev` with `.env` values pre-injected into `process.env`, i.e. what `vercel dev` does | `from-dot-env` (bug) |

In both cases the server banner prints `- Environments: .env.local, .env`, so
`.env.local` is loaded but loses to the inherited `.env` value.

`npm run dev:vercel-sim` starts only case B on port 3001 for manual inspection.
`vercel dev` itself cannot be executed here (no Vercel credentials), so
`vercel-dev-sim.js` reproduces its env-injection behaviour with `dotenv`.
