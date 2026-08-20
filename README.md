# Reproduction: route handler `redirect()` ignores `basePath` (vercel/next.js#56229)

The reporter's repo (https://github.com/nahtnam/base-path-bug) is deleted (404), so this is a minimal re-creation.

`next.config.js` sets `basePath: '/app'`.

```bash
npm install
npm run dev
curl -sI http://localhost:3000/app/server-component   # location: /app/home  (correct)
curl -sI http://localhost:3000/app/route              # location: /home      (BUG -> 404)
```

Same result with `npm run build && npm start`. Verified with next@16.3.1-canary.25.
