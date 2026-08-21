# Repro: `turbopack.resolveAlias` ignores `next/link` (vercel/next.js#90929)

```bash
pnpm install   # or npm install
pnpm build
pnpm verify    # exits 1: custom Link module is not in the build
```

`app/page.tsx` imports `next/link`, which `next.config.ts` aliases to
`src/components/Link.tsx`. The alias is ignored and Next.js' built-in Link is used:
no `CUSTOM_LINK_USED` console log, and `/about` is still prefetched even though the
custom Link sets `prefetch={false}` for `target="_blank"`.

`app/control/page.tsx` imports `aliased-link`, aliased to the same file — that alias
*is* applied, so only `next/link` (hard-coded in `next-core`'s import map) is exempt.
