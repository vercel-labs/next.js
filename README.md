# Repro: next.js#72555 — `Namespace 'React' has no exported member 'PromiseLikeOfReactNode'`

Minimal pages-router app matching the reporter's config (`skipLibCheck: false`,
`typescript@5.0.4`, `@types/react@18.2.79`).

```bash
npm install
npm run build   # next build
```

* `next@13.5.4` → `✓ Compiled successfully` (exit 0)
* `next@13.5.5` / `13.5.7` → `Failed to compile.`
  `./node_modules/next/dist/client/components/error-boundary.d.ts:26:71`
  `Type error: Namespace 'React' has no exported member 'PromiseLikeOfReactNode'.`
* `next@14.2.15` → fixed

Switch versions with `npm i next@13.5.4` / `npm i next@13.5.5`.

Cause: 13.5.5's shipped `.d.ts` files widened the declaration import graph, so
`next/dist/client/components/error-boundary.d.ts` is now pulled into the user's
TS program (`npx tsc --listFiles` shows it only for 13.5.5). That file still
references `React.ReactFragment` / `React.PromiseLikeOfReactNode`, which no
longer exist in current `@types/react`, so any project with
`skipLibCheck: false` fails. Setting `skipLibCheck: true` works around it.
