# Repro: `turbopackRustReactCompiler` renames the `<table>` intrinsic to `<table_0>`

Reproduction for https://github.com/vercel/next.js/issues/95557

With `reactCompiler: true` + `experimental.turbopackRustReactCompiler: true`, a client component
that has:

1. `const table = useReactTable(...)` (from `@tanstack/react-table`),
2. a nested `const table = '...'` shadow inside a `useEffect`,
3. `table` passed as a JSX prop (`<Toolbar table={table} />`),
4. an early return so the server output lacks the `<table>`,

emits the lowercase `<table>` **intrinsic** as an unknown `<table_0>` element on the client,
producing hydration errors.

## Run

```bash
pnpm install
pnpm dev           # then open http://localhost:3000
# or production:
pnpm build && pnpm exec next start
```

In the browser console:

```js
document.getElementsByTagName('table_0').length // 1  (bug)
document.getElementsByTagName('table').length   // 0
```

Automated check (needs `pnpm add -D playwright && pnpm exec playwright install chromium`):

```bash
node verify.mjs
```

Expected output when the bug is present:

```
/        {"t0":1,"t":0}   <- BUG: <table> intrinsic emitted as <table_0>
/renamed {"t0":0,"t":1}   <- control: shadow renamed to dbTable -> correct
/no-dep  {"t0":0,"t":1}   <- control: plain memoized object instead of useReactTable -> correct
```

## Notes

- Reproduces on `next@16.3.0-canary.78` and `next@16.3.1-canary.26`.
- Reproduces in `next dev` **and** in `next build` + `next start`.
- Removing `experimental.turbopackRustReactCompiler` (Babel React Compiler only) renders `<table>` correctly.
- Console errors: `The tag <table_0> is unrecognized in this browser.`,
  `In HTML, <thead> cannot be a child of <table_0>. This will cause a hydration error.`
