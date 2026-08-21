# Repro: vercel/next.js#86478

`npx @next/codemod@latest middleware-to-proxy` does not rename `middleware.ts` to
`proxy.ts` when the file's contents did not need any change.

## Run

```bash
./repro.sh
```

Requires network access (`npx @next/codemod@latest`, verified with 16.3.1) and `git`.

## Result

| case | files after codemod | jscodeshift result |
| --- | --- | --- |
| `case-no-changes-needed` (`export { auth as middleware } from './auth'`) | `middleware.ts` (NOT renamed) | `1 unmodified` |
| `case-changes-needed` (`export function middleware()`) | `proxy.ts` | `1 skipped` (file replaced) |

## Cause

`transforms/middleware-to-proxy.ts` returns early at `if (!hasChanges) return file.source`
before reaching `handleMiddlewareFileRename(file, source)`, so a middleware file that
needs no edits is never renamed.
