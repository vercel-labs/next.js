# Reproduction for vercel/next.js#97228

Next.js TypeScript plugin diagnostics are not reported by any CLI type check.

## Run

```bash
npm install
npx tsc --noEmit          # exit 0 — no ts(71008)
npx next build            # TypeScript phase passes — no ts(71008)
npx next check            # not a subcommand
npx next tsc              # not a subcommand
node scripts/plugin-diagnostics.mjs  # what a `next tsc` could report: ts(71008)
```

`scripts/plugin-diagnostics.mjs` loads the `next` TS language-service plugin the
same way an editor does and prints `getSemanticDiagnostics()`, showing the
diagnostic that CLI/CI type checking currently misses.
