# Repro: importing `zx` in an RSC crashes with ENOENT on `package.json`

Issue: https://github.com/vercel/next.js/issues/76637

## Run

```bash
pnpm install
pnpm dev   # then open http://localhost:3000  -> 500
# or
pnpm build # fails: "Failed to collect page data for /"
```

## Observed

`app/page.tsx` only imports (never calls) `glob` from `zx@8.3.2`. Because `zx` is bundled
for the server, its top-level `fs.readJsonSync(new URL('../package.json', import.meta.url))`
resolves relative to the bundle output instead of the package, and evaluation throws:

- Turbopack (Next 16.3.1-canary.25):
  `ENOENT: no such file or directory, open '/ROOT/node_modules/.pnpm/zx@8.3.2/node_modules/zx/package.json'`
- Webpack (Next 15.2.1-canary.1):
  `ENOENT: no such file or directory, open '<project>/.next/server/package.json'`

Adding `serverExternalPackages: ['zx']` to `next.config.js` avoids it, as does upgrading to `zx@8.8.5`.
