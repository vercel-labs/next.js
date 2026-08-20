# Repro: vercel/next.js#58281

`redirect()` from a Server Action does not update the browser URL when middleware
redirects to a locale-prefixed path.

Reporter's original repo (dev2xl/nextjs-redirect-bug-example) is no longer public,
so this is a minimal rebuild. Verified on `next@16.3.1-canary.25` (dev and prod).

## Run

```bash
npm install
npm run dev        # http://localhost:3000/en
# optional automated check (needs playwright installed):
node verify.mjs
```

## Steps

1. Open `/en`.
2. Click "Go To Login Page" (`<Link href="/login">`) -> middleware 307s to `/en/login`,
   browser URL becomes `/en/login`. Correct.
3. Go back to `/en` and click "submit form (server action redirect)", which runs
   `redirect('/login')` inside a server action.

## Expected

Browser URL is `/en/login`.

## Actual

Page renders the `[locale]/login` route with `locale = en`, but the browser URL stays
at `/login` — a path that has no route in the app. The middleware redirect is followed
server-side but the resulting location is not reflected in history.

```
after link click     URL = http://localhost:3000/en/login | body = Login page, locale = en
after server action  URL = http://localhost:3000/login    | body = Login page, locale = en
```
