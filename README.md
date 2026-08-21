# Repro for vercel/next.js#77199

The Next.js TypeScript plugin validates App Router segment config exports
(`revalidate`, `dynamic`, ...) only in `page.*` / `layout.*` files. In
`route.ts` route handlers the same invalid values produce no diagnostic.

## Run (headless, no IDE needed)

```bash
pnpm install
node check-plugin.mjs app/page.tsx app/api/route.ts
```

`app/page.tsx` reports error 71003 (`"asdf" is not a valid value for the
"revalidate" option.`); `app/api/route.ts` reports `[]`.

`check-plugin.mjs` drives `tsserver` with the `next` TS plugin enabled
(the same code path the VS Code extension uses) and prints
`semanticDiagnosticsSync` for each file.
