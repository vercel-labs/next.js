# Repro: `@next/next/no-async-client-component` misses non-default exports (vercel/next.js#77243)

```
npm install
npm run lint
```

## Expected
All three fixtures are async Client Components, so all three should be reported.

## Actual
Only `fixtures/c.jsx` (the `export default` form) is reported. The named-export forms
(`fixtures/a.jsx`, `fixtures/b.jsx`) produce no diagnostic, because the rule only
inspects `ExportDefaultDeclaration` nodes:
https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/rules/no-async-client-component.ts

Also reproduced with `next lint` / `eslint-config-next@15.2.3` (the reporter's setup) and with
`@next/eslint-plugin-next@canary` (16.3.1-canary.26).
