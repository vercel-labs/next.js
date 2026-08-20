# Repro: BrowserslistError with `current node` in .browserslistrc (webpack build)

Issue: https://github.com/vercel/next.js/issues/38898

```bash
npm install
npx next build --webpack   # fails: BrowserslistError: Unknown version <your node version> of Node.js
npx next build             # Turbopack: succeeds
```

Requires a `.browserslistrc` with `current node` **and** at least one CSS file (postcss-preset-env/autoprefixer path).
`browserslist` expands `current node` to the exact running version (e.g. `node 24.17.0`), which
postcss-preset-env then re-parses against Next.js' bundled (stale) node-releases data -> unknown version.
