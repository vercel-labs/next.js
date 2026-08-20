# Repro: app-router i18n cannot serve the default locale at `/` (issue #48197)

Minimal app-router i18n setup copied from the documented pattern
(`examples/app-dir-i18n-routing`): `app/[lang]/...` + a middleware that
detects the locale and redirects when the pathname has no locale prefix.

Verified with `next@16.3.1` (behavior unchanged since 13.2.x).

## Run

```bash
npm install
npm run dev      # or: npm run build && npm start
curl -sI http://localhost:3000/
curl -sI http://localhost:3000/about
```

## Observed (documented redirect approach, `middleware.ts`)

```
GET /       -> 307 location: /en
GET /about  -> 307 location: /en/about
GET /en     -> 200 "Home (en)"
```

There is no way to serve the default locale at the bare domain: every URL
gains an `/en` prefix.

## Workaround the docs do not mention

`cp middleware.rewrite.ts.example middleware.ts` (rewrite instead of redirect
for the default locale), rebuild, then:

```
GET /       -> 200 <h1 id="home">Home (en)</h1>
GET /about  -> 200 <h1 id="about">About (en)</h1>
GET /fr     -> 200 "Home (fr)"
```

So the capability exists; the i18n docs only show the redirect variant, which
forces `/en` into every URL.
