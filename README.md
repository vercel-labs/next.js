# Repro: next.js#77381 — eslint-config-next fails in JS-only projects ("Cannot find module 'typescript'")

`create-next-app` JS template (no TypeScript) + a package manager that does NOT auto-install
peer dependencies (yarn 1 / pnpm) => `eslint-config-next` crashes because
`typescript-eslint` requires `typescript` at load time.

## Run
```
yarn install   # note: unmet peer dependency "typescript" warnings
yarn lint
```

## Actual
```
Error: Cannot find module 'typescript'
Require stack:
- node_modules/typescript-eslint/dist/index.js
- node_modules/eslint-config-next/dist/index.js
- node_modules/eslint-config-next/dist/core-web-vitals.js
```

## Expected
Linting a JavaScript-only project should not require `typescript` to be installed.

## Notes
- `npm` hides the bug because npm auto-installs the peer `typescript`.
- Workaround: `yarn add --dev typescript@5` (lint then passes).
