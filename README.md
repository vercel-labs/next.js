# Reproduction: vercel/next.js#83288 — `next start` needs TypeScript at runtime for `next.config.ts`

Deployment timeout on Azure Static Web Apps after 15.3.5.

## Root cause observed

Since **15.4.0**, `next.config.ts` is transpiled with the real `typescript` package
(`dist/build/next-config-ts/transpile-config.js` calls `installDependencies`).
In 15.3.5/15.3.6 the config was transpiled with the bundled SWC, so no `typescript`
was needed at runtime.

Hosting platforms such as Azure SWA build with devDependencies and then run the app
from a production-only install. There `next start` prints
`Installing TypeScript as it was not found while loading "next.config.ts"`, shells out to
`npm install`, and then exits without ever serving a request — the platform warm-up
probe times out.

## Run

```bash
npm run repro
```

Expected (15.3.5): server ready, `http_status=200`.
Actual (>= 15.4.0, verified on 15.5.6): server never becomes ready, `http_status=000`.

### Control (works)

```bash
sed -i 's/"next": "15.5.6"/"next": "15.3.5"/' package.json && rm -rf node_modules .next
npm run repro
```

## Logs captured locally

- 15.5.6, pruned install, registry reachable:
  `Installing TypeScript ...` → `added 5 packages` → `⨯ Failed to load next.config.ts` +
  `Error: Cannot find module 'typescript'` (crash even after the install succeeds),
  and `package.json` is mutated (typescript re-added to devDependencies).
- 15.5.6, pruned install, registry unreachable: `npm error ECONNRESET` →
  `Failed to install TypeScript, please install it manually to continue` →
  `⨯ Failed to load next.config.ts`, no HTTP response.
- 15.3.5, pruned install: `✓ Ready in 366ms`, `HTTP 200`.
