# Repro: standalone output does not copy `.env.local` (vercel/next.js#46296)

```bash
npm install
npm run build
ls -a .next/standalone           # only .env and .env.production are copied
cp -r .next/standalone /tmp/deploy && cd /tmp/deploy && PORT=3010 node server.js
curl -s localhost:3010
```

Expected: all three vars defined. Actual: `API_URL_FROM_ENV_LOCAL` is `null`.

Root cause: `writeStandaloneDirectory` in `next/dist/build/index.js` copies only
env files whose name is `.env` or `.env.production`.
