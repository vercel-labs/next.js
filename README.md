# Reproduction: next-lint-to-eslint-cli emits Next-16-only flat config on a Next 15 project

Issue: https://github.com/vercel/next.js/issues/97347

## Run

```bash
npm install
git init && git add -A && git commit -m init   # codemod requires a clean tree
npx @next/codemod@canary next-lint-to-eslint-cli .
npm run lint
```

or `bash repro.sh`

## Observed (@next/codemod 16.3.1-canary.16)

The codemod reports "Migration complete!" and writes:

```js
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
export default defineConfig([{ extends: [...nextCoreWebVitals] }]);
```

`eslint-config-next` is left at 15.5.23, which has no `exports` map, so `npm run lint` fails:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'.../node_modules/eslint-config-next/core-web-vitals' imported from '.../eslint.config.mjs'
Did you mean to import "eslint-config-next/core-web-vitals.js"?
```

Even with the `.js` suffix it would fail: 15.x exports `{ extends: [...] }`, so
`[...nextCoreWebVitals]` throws "is not iterable".
