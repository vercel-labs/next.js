# next#49309 — module imported from different files is re-evaluated

`lib/cache.js` is a singleton module imported by:

- `app/page.js` (App Router server component)
- `app/change/route.js` (App Router route handler)
- `pages/api/change.js` (Pages API route)

Each entry point gets its **own** evaluation of `lib/cache.js`, so mutations made
through one entry point are invisible to the others.

## Run

```bash
npm install
npm run build
npm start           # or: npm run dev
npm run repro       # drives the endpoints against http://localhost:3000
```

`repro.mjs` requests `/`, then `/change`, then `/api/change`, then `/` again.

## Observed (next@16.3.1-canary.25, production `next start`)

```
[cache.js] module evaluated -> new Cache instance #1
[cache.js] module evaluated -> new Cache instance #1     <- second, independent module instance
[app/page] cache id = 1
[cache.js] module evaluated -> new Cache instance #1     <- third, independent module instance
[app/change/route] setting id to 3
[cache.js] setId(3)
[app/page] cache id = 1
[pages/api/change] setting id to 2
[cache.js] setId(2)
[app/page] cache id = 1
```

`instances` stays at 1 in every log line, proving the whole module (not just the
class) was evaluated three separate times. The page keeps reporting `1` after
both mutations.

## Expected

`lib/cache.js` is evaluated once per server process and the same instance is
shared by all importers, per the ES module specification.
