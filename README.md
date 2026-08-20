# Repro for vercel/next.js#21210

i18n `domains` config still serves locale-prefixed URLs on every domain (200 instead of 404/redirect).

```
npm install
npm run build
npm start        # :3000
./check.sh
```

Expected: only `/` and `/about` per domain. Actual: `/en`, `/en/about`, `/pl`, `/pl/about` return 200 on both `example.com` and `example.pl`.
