# Repro: next#76803 — server action errors are NOT caught by error.js unless in a transition

Next.js 16.3.1 (also applies to earlier App Router versions).

## Run

```
npm install
npm run build && npm run start   # or: npm run dev
```

Open http://localhost:3000 and click each button.

- `call action directly in onClick` (`await action()` in an async event handler):
  the error is **uncaught** (window `error` event / "Unhandled Runtime Error"), `app/error.js` is NOT rendered.
- `call action inside startTransition`: the error **is** caught and `app/error.js` renders.

Optional automated check (installs Playwright):

```
npm i -D playwright && npx playwright install chromium
node test.js
```

The docs section "Error Handling" for Server Actions states errors are caught by the nearest
`error.js`/`<Suspense>` boundary, without mentioning that this only happens when the action is
called from a transition (form action, `useActionState`, or `startTransition`).
