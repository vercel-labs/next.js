# Repro: TS71007 not reported for `export default <identifier>` (vercel/next.js#55332)

The Next.js TypeScript plugin warning `TS71007: Props must be serializable for
components in the "use client" entry file` is not reported when the default
export is an identifier (`const C = () => {}; export default C`).

## Run

```bash
npm install
npm run check
```

`check.mjs` starts `tsserver` in this project (whose `tsconfig.json` enables
`"plugins": [{ "name": "next" }]`), asks for `semanticDiagnosticsSync` on the
repro files and prints them — i.e. exactly what an editor language server shows.

## Expected vs actual

`app/components.tsx` has three `"use client"` components that all take a
non-serializable `myFunc: () => void` prop:

| export style | TS71007 |
| --- | --- |
| `const myComponent = ...; export default myComponent` | **missing (bug)** |
| `export const myComponent2 = ...` | reported |
| `export function myComponent3` | reported |
| `export default function` (control, `app/inline-default.tsx`) | reported |

Actual output:

```
--- app/components.tsx ---
  line 4: TS71007 [warning] Props must be serializable ... "myFunc" ...
  line 4: TS71007 [warning] Props must be serializable ... "myFunc" ...

--- app/inline-default.tsx ---
  line 4: TS71007 [warning] Props must be serializable ... "myFunc" ...

app/components.tsx TS71007 warnings: 2 (expected 3)
RESULT: BUG REPRODUCED - only 2/3 export styles warn
```

## Cause

`packages/next/src/server/typescript/index.ts` walks top-level nodes and handles
`isVariableStatement` (export const), `isDefaultFunctionExport`
(`export default function`), `isFunctionDeclaration` (export function) and
`isExportDeclaration` (`export { ... }`). There is no branch for
`ts.isExportAssignment` (`export default someIdentifier`), so the client
boundary rule in `rules/client-boundary.ts` never runs for that node.
