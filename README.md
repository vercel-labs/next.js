# Reproduction: duplicate `next/cache` auto-import suggestions after `next build`

Upstream issue: https://github.com/vercel/next.js/issues/77823

## Run

```bash
npm install
npm run check   # before build  -> 1 suggestion (OK)
npm run build
npm run check   # after build   -> 2 suggestions (FAIL)
```

`check-completions.js` asks the TypeScript language service for the same
auto-import completion list an editor shows for `revalidatePath`.

## What happens

`next build` writes `.next/types/cache-life.d.ts`, which contains an ambient
`declare module 'next/cache'` block re-exporting `revalidatePath`,
`revalidateTag`, `unstable_expirePath`, `unstable_expireTag`, `unstable_cache`
and `unstable_noStore`.

`tsconfig.json` includes `.next/types/**/*.ts`, so that ambient module is loaded
in addition to the real `node_modules/next/cache.d.ts`. TypeScript then has two
export-map entries for every `next/cache` export and offers each of them twice
in autocomplete.

Deleting `.next` makes the duplicates disappear; rebuilding brings them back.
