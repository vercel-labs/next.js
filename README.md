# Repro: issue #67550 — first dev navigation bounces back when destination page lazy-imports a module using decorators

Pages Router. `/other` uses `next/dynamic` to load a component whose class uses a legacy
decorator, so the `@swc/helpers` decorator helper is not in the initial bundle. On the first
client navigation from `/` to `/other`, webpack dev HMR forces a full reload and lands back on `/`.
The second click works.

## Run

```bash
npm install
npm run dev          # next 14.2.1 (webpack dev)
# open http://localhost:3000, click "Go to other"
```

Automated check (requires `playwright` + `npx playwright install chromium`):

```bash
node verify.mjs
```

## Observed

- next@14.2.1 dev: click -> URL becomes /other -> full reload -> back on / ("Home"). Second click reaches /other.
- Control: replacing the `next/dynamic` call in `pages/other.tsx` with a static
  `import Decorated from '../components/Decorated'` -> navigation works on the first click.
- next@16.3.1 with `next dev --webpack`: still reproduces.
- next@16.3.1 with Turbopack (default dev): does NOT reproduce.
