# Issue #84067 — build lifecycle hooks

Reporter asked for build hooks (e.g. `runAfterProductionCompile`) to copy static
files after `next build`. The requested `compiler.runAfterProductionCompile`
hook already exists (Next.js >= 15.2, PR #77345).

Run:

    npm install
    npm run build

Observed on next@16.3.1-canary.26: the hook fires after compilation and before
type-check/static generation, and the copied files land in `.next/copied-static`.

Still missing: a post-static-generation hook (`runAfterStaticPageGeneration`).
