# Repro: `not-found.js` renders on every page (vercel/next.js#67532)

Original reporter repo (https://github.com/itsLaserr/min-repro) is deleted; this is a fresh minimal repro.

```
npm install
npm run dev      # then: curl http://localhost:3000/
# or
npm run build && npm run start   # then: curl http://localhost:3001/ and /other
```

Server logs print `>>> NOT-FOUND component rendered` before every successful page render.

Workaround: `experimental.globalNotFound: true` + `app/global-not-found.js` (not-found no longer rendered for found pages).
