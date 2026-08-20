# Reproduction for vercel/next.js#71889

`Module '"next"' has no exported member 'Metadata' / 'NextConfig'` after upgrading
from Next.js 14 to 15 with Turbopack.

## Root cause (confirmed by this repro)

Next.js **14** (webpack + `experimental.typedRoutes`) writes `.next/types/link.d.ts`
containing an ambient declaration:

```ts
declare module 'next' {
  export { default } from 'next/types/index.js'
  export * from 'next/types/index.js'
  ...
}
```

Next.js **15** removed `next/types/index.d.ts` (the types moved to `next/types.d.ts`).
The stale ambient `declare module 'next'` still wins over `node_modules/next/index.d.ts`,
but its `export * from 'next/types/index.js'` no longer resolves, so `next` appears to
export nothing → `TS2614: Module '"next"' has no exported member 'Metadata'`.

`tsconfig.json` pulls the stale file in via `"include": [".next/types/**/*.ts"]`.

* `next dev` (webpack) rewrites/removes `.next/types/link.d.ts`, so the error disappears.
* `next dev --turbo` never writes `.next/types/**`, so the stale file survives → error persists.
* `rm -rf .next` also fixes it (matches the comments on the issue).
* Still reproducible on Next.js 16.2.6, where Turbopack writes to `.next/dev/types` and
  never touches the legacy `.next/types` directory.

## Steps

```bash
npm install --legacy-peer-deps
npm run setup        # restores the .next/types/link.d.ts that Next 14.2.4 generated
npm run typecheck    # FAILS: TS2614 for Metadata / NextConfig  <-- the bug
npm run dev          # next dev --turbo, then in another shell:
npm run typecheck    # still FAILS (Turbopack leaves the stale file)
# now the reported workaround:
npm run dev:webpack  # next dev (webpack), hit http://localhost:3000
npm run typecheck    # PASSES
```

Interim workaround: `rm -rf .next` (or import from `next/types`).
