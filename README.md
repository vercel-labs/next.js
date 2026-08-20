# Repro: next/babel + Server Actions (vercel/next.js#57966)

Minimal reproduction of "Server Actions must be async functions" when using the
default `next/babel` preset (Babel instead of SWC) with a Server Action.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/test
```

The page returns HTTP 500 and the dev server logs:

```
x Server Actions cannot use `arguments`.
x Server Actions must be async functions.
   ,-[app/test/action.ts:5:1]
 5 | export function action() {
 6 |   return _action.apply(this, arguments);
```

Cause: `next/babel` (preset-env with default/older browser targets) downlevels the
`async function action()` into a sync wrapper + `_asyncToGenerator`, so the Next.js
server-actions checker no longer sees an async function.

Notes:
- Babel is only applied by the webpack bundler, so the scripts use `--webpack`
  (Turbopack is the default from Next.js 16 and does not hit this path).
- Workarounds: delete `.babelrc` (use SWC) or set modern preset-env targets, e.g.
  `{"presets":[["next/babel",{"preset-env":{"targets":{"chrome":117}}}]]}`.
