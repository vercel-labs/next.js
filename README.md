# next/jest ignores user `transformIgnorePatterns` for ESM-only node_modules (vercel/next.js#40183)

Verified on `next@16.3.1-canary.25`, `jest@29.7.0`, Node 24.

## Run

```bash
npm install --legacy-peer-deps
npm test        # FAILS: SyntaxError: Cannot use import statement outside a module (node_modules/nanoid/index.browser.js)
npm run dev     # works: GET / -> 200, ESM dep is transpiled by Next.js
```

`jest.config.js` sets `transformIgnorePatterns: ['/node_modules/(?!nanoid/)']`, but `next/jest`
appends it after its own `'/node_modules/(?!.pnpm)(?!(...)/)'` entry. Jest ignores a file when
*any* pattern matches, so a user negative-lookahead pattern can never re-enable transformation
of a `node_modules` package.

Workaround: add the package to `transpilePackages` in `next.config.js`
(`module.exports = { transpilePackages: ['nanoid'] }` makes `npm test` pass).
