# Repro: standalone `server.js` hardcodes `NODE_ENV=production` (vercel/next.js#58294)

The reporter's linked repo (`HugoDerigny/standalone-production-env-bug`) is deleted (404), so this is a
minimal replacement.

`.next/standalone/server.js` contains `process.env.NODE_ENV = 'production'`, which overrides an
explicitly provided `NODE_ENV` and makes the runtime load `.env.production` instead of `.env.test`.
`next start` does not do this.

## Steps

```bash
npm install
NODE_ENV=test npx next build          # build logs: "- Environments: .env.test"
head -5 .next/standalone/server.js    # process.env.NODE_ENV = 'production'
cp .env.test .env.production .next/standalone/
(cd .next/standalone && NODE_ENV=test PORT=3020 node server.js)
curl -s http://localhost:3020         # runtimeNodeEnv: production, MY_ENV_NAME: from-env-production

# contrast:
NODE_ENV=test PORT=3021 npx next start
curl -s http://localhost:3021         # MY_ENV_NAME: from-env-test
```

Observed with next@16.3.1-canary.25, Node 24.

`app/page.js` reads `process.env['NODE_' + 'ENV']` so the value is not inlined at build time.
