# Repro: `typedRoutes` invalid `Link href` not enforced by `tsc` (next#93007)

`next-env.d.ts` only `import`s `./.next/types/routes.d.ts`. The `next/link` route
augmentation lives in `.next/types/link.d.ts`, which is pulled in *only* via the
tsconfig `include` glob `.next/types/**/*.ts`. Any `exclude` entry covering `.next`
(common in shared/base tsconfigs, e.g. the reporter's monorepo `@repro/tsconfig`)
silently drops it, because `exclude` wins over `include`. Route metadata
(`PageProps` etc.) still works, so nothing looks broken.

## Run

```bash
npm install
npm run typegen
npm run check            # exits 0 -- BUG: invalid href accepted
npm run check:with-link  # exits non-zero: TS2322 as expected
```

`app/page.tsx` contains `<Link href="/definitely-not-a-real-route">`.

Proof that only file inclusion matters: `tsc --noEmit --listFiles | grep .next`
lists `routes.d.ts` but never `link.d.ts`. Removing `.next` from `exclude`, or
appending `import "./.next/types/link.d.ts";` to `next-env.d.ts`, makes the
default `tsc --noEmit` fail correctly.
