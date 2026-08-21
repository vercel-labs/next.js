# Repro: `Failed to read source code from <abs path>` dev overlay is not actionable (vercel/next.js#84385)

The reporter's link (CodeSandbox dashboard sign-in) is private, so this is a minimal
reproduction of the reported `Failed to read source code from ...` dev error.

## Steps

1. `npm install`
2. `npm run dev` (webpack dev mode - the error only exists there)
3. Open http://localhost:3002 -> renders `hello`
4. With the dev server still running, rename the imported file:
   `mv app/util.ts app/util.tsx`
5. Reload http://localhost:3002

## Observed

Dev overlay + terminal show:

```
./app/util.ts
Error:

Caused by:
    0: Failed to read source code from /abs/path/app/util.ts
    1: No such file or directory (os error 2)
```

- The overlay's only clickable target is the header `./app/util.ts`, which sends
  `GET /__nextjs_launch-editor?file=./app/util.ts&line1=1&column1=1` for a file that no
  longer exists, so clicking never opens a file.
- The absolute path printed inside the error body is plain text, not a link.
- The real culprit (`app/page.tsx`, the stale importer) is never linked.

## Notes

- A plain wrong import path (`import x from './totally/wrong/path'`) instead produces
  `Module not found: Can't resolve ...` whose code frame link *does* open `app/page.tsx`.
- `npm run dev:turbopack` (default in Next 16) does not produce this error at all after the rename.
