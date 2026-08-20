# Repro attempt for vercel/next.js#48609

`notFound()` in a dynamic segment nested under folders inside a route group.

Routes:
- `app/(site)/memberships/benefits/[slug]/page.js` + `.../benefits/not-found.js` (nested not-found expected)
- `app/(site)/deep/a/b/[slug]/page.js` (only root `app/not-found.js` exists)
- `app/(site)/catch/[...slug]/page.js` (catch-all)
- `app/simple/[slug]/page.js` + `app/simple/not-found.js` (control)

## Run
```
npm install
npm run dev   # then visit /memberships/benefits/bad, /deep/a/b/bad, /catch/bad/x, /simple/bad
# or: npm run build && npm start
```

## Result on next@16.3.1-canary.25
All routes return HTTP 404 and render the nearest `not-found.js` inside its layouts
(`BENEFITS not-found` for /memberships/benefits/bad, `ROOT not-found` for /deep/a/b/bad and /catch/bad/x),
in dev, production, and on client-side `<Link>` navigation. No error thrown. Issue does not reproduce.
