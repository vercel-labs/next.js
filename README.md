# Repro: next#78446 — standalone output nests server.js under the app path in a monorepo

Minimal npm-workspaces monorepo (no Turborepo needed) with `output: 'standalone'` in `apps/www`.

## Run

```bash
npm install
cd apps/www
npx next build
ls .next/standalone            # -> apps  node_modules
ls .next/standalone/apps/www   # -> server.js, .next, package.json
```

Expected per docs: `server.js` directly in `.next/standalone`.
Actual: `.next/standalone/apps/www/server.js`.

Confirmed with next 15.3.1 and 16.3.1. The nested server.js runs fine
(`cd .next/standalone/apps/www && PORT=3010 node server.js` -> HTTP 200),
so only the layout/documented path differs.
