# Repro: Server Actions don't respect `NextResponse.redirect` from middleware/proxy

Issue: https://github.com/vercel/next.js/issues/65394

Next.js 16.3.1 (also reported on 14.3.0-canary / 15.x).

## Run

```bash
npm install
npm run dev      # or: npm run build && npm start
# open http://localhost:3000 and click "Run server action"
```

Automated check (needs `npm i -D playwright && npx playwright install chromium`):

```bash
node repro-test.mjs
```

## Expected

Middleware returns `NextResponse.redirect('/login')` for POST requests, so clicking the
button should navigate the browser to `/login`.

## Actual

- Middleware responds `307` to the Server Action POST (`/` -> `/login`).
- The Server Action `fetch` transparently follows the redirect (`POST 200 /login`) and gets
  an HTML document instead of a Flight response.
- The browser stays on `/` (`#home` still rendered, `#login` never rendered).
- The action call rejects with a generic `Error: An unexpected response was received from the server.`
- `app/actions.js` never runs (no `[server action] executed` in the server log).
