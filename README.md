# Repro: Next.js TypeScript plugin diagnostics are not reported by any CLI check

Issue: https://github.com/vercel/next.js/issues/97229

`app/page.tsx` exports `metadata` without the `Metadata` type, which the Next.js
TypeScript language-service plugin flags as `ts(71008)` in the editor. No CLI
command surfaces it.

## Run

```bash
npm install
npx tsc; echo "tsc exit: $?"          # exit 0, no diagnostics
npx next build; echo "build exit: $?" # exit 0, "Finished TypeScript" clean
npx next check                        # not a subcommand
npx next tsc                          # not a subcommand
node plugin-diagnostics.mjs           # plugin DOES report ts(71008)
```

`plugin-diagnostics.mjs` mirrors `test/development/typescript-plugin/test-utils.ts`
from vercel/next.js: it builds a `ts.LanguageService`, wraps it with the `next`
plugin and calls `getSemanticDiagnostics()`.

## Observed

```
$ npx tsc; echo $?
0
$ npx next check
Invalid project directory provided, no such directory: .../check
$ node plugin-diagnostics.mjs
plugin-wrapped language service diagnostics for app/page.tsx:
  ts(71008) [Warning] The Next.js "metadata" export should be type of "Metadata" from "next".

plain TypeScript (what `tsc` sees):
  (none)
```
