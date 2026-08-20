# Repro: vercel/next.js#59744 — `.js` extension not resolved for TypeScript sources

TypeScript's ESM guidance is to write `import './lib/greeting.js'` when the source file is
`lib/greeting.ts`. Next.js fails to resolve this with both Turbopack and webpack.

## Run

```bash
npm install
npx next build            # Turbopack: Module not found: Can't resolve './lib/greeting.js'
npx next build --webpack  # webpack:   Module not found: Can't resolve './lib/greeting.js'
```

Adding `resolve.extensionAlias = { '.js': ['.ts', '.tsx', '.js'] }` via the `webpack` config hook
makes the webpack build pass. There is no equivalent escape hatch for Turbopack.

Verified on Next.js 16.3.1-canary.25 / Node 24.
