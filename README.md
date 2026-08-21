# Repro: next.js#77240 — `redirect()` in an async client onClick logs `Uncaught (in promise) Error: NEXT_REDIRECT`

```bash
npm install
npm run dev   # open http://localhost:3000 with the browser console open
```

- Click **Redirect** (`onClick={() => redirect("/target")}`): navigates, console clean.
- Click **Redirect Async** (`onClick={async () => redirect("/target")}`): navigates **and** the
  browser console shows an unhandled rejection `Error: NEXT_REDIRECT`.

Confirmed with next 15.2.4 (dev) and next 16.3.1 (dev + `next build && next start`).
