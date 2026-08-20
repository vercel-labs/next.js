# Repro: `jsonpath` in an App Router route handler fails at runtime

Upstream issue: https://github.com/vercel/next.js/issues/61507

## Steps

```bash
npm install
npm run dev
curl -i http://localhost:3000/api/test
```

## Result

The request fails (HTTP 500 on Next 15/16, "not found" on Next 13) and the server logs:

```
Error: ENOENT: no such file or directory, open '[project]/node_modules/jsonpath/include/module.js [app-route] (ecmascript)'
```

Cause: `jsonpath/lib/grammar.js` runs
`fs.readFileSync(require.resolve("../include/module.js"))` at module init. The
bundler (webpack and Turbopack) rewrites `require.resolve` to a bundler module
id, so the runtime `fs` read of that "path" fails.

Works when the module is not bundled:

```js
// next.config.js
module.exports = { serverExternalPackages: ["jsonpath"] };
```

or with `export const runtime = "edge"`, or by removing the jsonpath call.
