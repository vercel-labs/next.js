# Reproduction: vercel/next.js#58707

`next/jest` never transforms `node_modules`, so importing an ESM-only package
(here `chalk`) from a test fails with
`SyntaxError: Cannot use import statement outside a module`.

```bash
npm install
npm test
```

Expected: test passes. Actual: `app/counter.test.tsx` fails to run while parsing
`node_modules/chalk/source/index.js`.

Workaround (verified): add the package to `transpilePackages` in `next.config.js`:

```js
module.exports = { transpilePackages: ["chalk"] };
```
