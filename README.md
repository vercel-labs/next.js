# Repro: TypeScript namespace merging emits unqualified reference (`a is not defined`)

Upstream issue: https://github.com/vercel/next.js/issues/89136

`lib.ts` declares `namespace Test` twice (valid TS, `tsc --noEmit` passes). SWC emits
`Test.b = a + 1` instead of `Test.b = Test.a + 1` for the merged declaration, so SSR
throws `ReferenceError: a is not defined`.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 -> HTTP 500, ReferenceError: a is not defined
```

Also fails in production (`npm run build`) and with `next build --webpack`,
so this is a next-swc transform bug, not Turbopack-specific.

Expected: renders `<h1>2</h1>`.
