# Repro: next.js#68790 — `transpilePackages` glob entry crashes webpack config with "Invalid regular expression"

Minimal reproduction of https://github.com/vercel/next.js/issues/68790

`next.config.js` contains a glob-looking entry (as in the reporter's project):

```js
module.exports = { transpilePackages: ['**@polkadot/**'] }
```

Next.js interpolates `transpilePackages` entries verbatim into a RegExp, so `**` throws.

## Run

```bash
npm install
npm run dev          # next 14.2.5 -> SyntaxError: Invalid regular expression ... Nothing to repeat
```

Latest Next.js (16.3.1):
- `next dev --webpack` -> same `SyntaxError: Invalid regular expression: ... Nothing to repeat`
- `next dev` (Turbopack) -> starts fine, `/` returns 200 (entry silently ignored, no config validation error)

There is no config validation error telling the user globs/regex are unsupported in `transpilePackages`.
