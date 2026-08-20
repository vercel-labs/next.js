# Issue 61050 — TS type for Pages API route `config`

The type does exist and is exported from `next` as `PageConfig`; it is just not
mentioned in the docs page for API route custom config.

```
npm install
npm run check
```

Expected output: only one error, from the intentional negative test in
`pages/api/hello.ts` (`'nope' does not exist in type 'PageConfig'`), which proves
`PageConfig` is resolvable and type-checks the `config` export.

Verified with next@16.3.1 and next@14.1.0 (the release at the time the issue was filed):
`node_modules/next/types/index.d.ts` / `next/dist/types.d.ts` both declare
`export type PageConfig = { api?: { responseLimit?, bodyParser?, externalResolver? }, env?, maxDuration?, runtime?, ... }`.
