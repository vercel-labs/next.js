# Investigation harness for vercel/next.js#88579

"Turbopack: Path doubling with outputFileTracingRoot in monorepo causes vercel build failure"

Yarn-workspaces monorepo (`apps/frontend` + `libs/common`), Next.js 15.3.8,
`next build --turbopack`, `output: 'standalone'`, `outputFileTracingRoot` = repo root.
Mirrors https://github.com/domhede/turbopack-monorepo-repro plus an offline harness
(`repro.sh`) that runs `vercel build` without a Vercel account by writing a
`.vercel/project.json` whose `settings.rootDirectory` is `apps/frontend` — the same
setting a real `vercel link`/`vercel pull` produces for this project.

## Run

    yarn install
    ./repro.sh

## Result (Node 24.17, Vercel CLI 50.4.0, Next.js 15.3.8)

| case | result |
| --- | --- |
| `next build --turbopack` in `apps/frontend` | ✅ exit 0, standalone output at `.next/standalone/apps/frontend/server.js` |
| `vercel build` inside `apps/frontend` (Root Directory = `apps/frontend`) | ❌ `Error: ENOENT ... /apps/frontend/apps/frontend/package.json` |
| same, with `outputFileTracingRoot` removed from `next.config.js` | ❌ identical doubling error |
| `vercel build` from the monorepo root | ✅ `Build Completed in .vercel/output` |

The doubling comes from the Vercel CLI joining the project's Root Directory setting
onto the current working directory; it is independent of `outputFileTracingRoot`,
Turbopack and `output: 'standalone'`. No Next.js-side defect was observed.
