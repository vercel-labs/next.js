# Repro: Next.js TS plugin warns on `metadata` typed with `satisfies` (vercel/next.js#84159)

The Next.js TypeScript language-service plugin emits
`The Next.js "metadata" export should be type of "Metadata" from "next".` (code 71008)
even when the object is typed with `satisfies Metadata`, because
`next/dist/server/typescript/rules/metadata.ts` `hasType()` only checks for a
type annotation (`!!node.type`) and ignores `SatisfiesExpression` initializers.

## Run

```bash
npm install
npm run repro
```

`check-plugin-diagnostics.mjs` starts `tsserver` with the `next` plugin enabled
(exactly what the IDE plugin does) and prints semantic diagnostics.

## Expected vs actual

```
=== app/page.tsx ===                       # `satisfies Metadata`
  [warning] 71008 line 4: The Next.js "metadata" export should be type of "Metadata" from "next".   <-- BUG
=== app/annotated/page.tsx ===             # `: Metadata` annotation (control)
  (no diagnostics)
=== app/viewport-only/page.tsx ===         # `satisfies Viewport`
  (no diagnostics)                         # viewport is not type-checked by the plugin at all
```

Reproduced with next 15.5.2 and next@canary 16.3.1-canary.26, TypeScript 5.9.2.
