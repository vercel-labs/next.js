# Reproduction: vercel/next.js#77679

`create-next-app` used to emit unsorted `dependencies` / `devDependencies`, so the first
`pnpm add <pkg>` rewrote (sorted) the whole block and produced a noisy git diff.

## Run

```bash
./repro.sh 15.2.4   # version from the issue report -> reproduces the noisy reorder
./repro.sh latest   # current release -> only the added dependency shows up in the diff
```

## Observed (sandbox, Node 24.17.0, pnpm 11.22.0)

`create-next-app@15.2.4` generates `react, react-dom, next` and
`typescript, @types/node, ..., @eslint/eslintrc`; `pnpm add @radix-ui/react-popover`
rewrites both blocks alphabetically (11 changed lines instead of 1).

`create-next-app@latest` (16.3.1) already generates sorted `next, react, react-dom` and
sorted devDependencies; the same `pnpm add` yields a single added line.
Templates are still unsorted in 15.3.0–15.5.0.
