# Repro: vercel/next.js#79562 — `output: 'export'` missing from the `output` config reference

`next.config.js` accepts `output: 'standalone' | 'export'`
(`packages/next/src/server/config-schema.ts`: `output: z.enum(['standalone', 'export']).optional()`),
but the reference page https://nextjs.org/docs/app/api-reference/config/next-config-js/output
(source: `docs/01-app/03-api-reference/05-config/01-next-config-js/output.mdx`) only documents
`standalone` and is written as an explanation of Output File Tracing rather than a value reference.
`output: 'export'` is only covered in the guide `docs/01-app/02-guides/static-exports.mdx`.

## Run

```bash
./verify.sh
```

Exits 0 (issue reproduced) when the reference doc contains no `output: 'export'`.
