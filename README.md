# Repro for vercel/next.js#63141 — `useActionState`/`useFormState` + sensitive data

Verified with next@16.3.1, react@19.2.8 (Node 24).

```bash
npm install
npm run build && npm start   # http://localhost:3001
# inspect the server-rendered HTML:
curl -s http://localhost:3001/ | grep -o '<input type="hidden"[^>]*>'
# optional end-to-end check (submits both forms):
npx playwright install chromium && node check.mjs
```

`app/page.jsx` renders two client forms that both call `useActionState`:

- **bind()**: `submitContactForm.bind(null, recipients)` — the bound secret is emitted
  **in plaintext** into `<input type="hidden" name="$ACTION_n:1" value="[[\"SUPER_SECRET_EMAIL@example.com\"],{}]">`.
- **closure**: an inline `'use server'` function defined in the server component that closes
  over `recipients` — the bound value is an **encrypted opaque string**
  (`$ACTION_n:2` = `"zy3CK3sCAJgu…"`), and the secret never appears in the HTML.

Both forms invoke the action successfully; only the `bind()` variant leaks the secret.
This confirms the reporter's observation and is the behavior the docs should document.
