# Repro: `updateTag()` inside an intercepted parallel-route modal triggers a hard reload (404) — next.js#93277

Repaired mirror of https://github.com/lucas-garrido/nextjs-issue-reproduction
(the original failed `next build` / typecheck: `app/@modal/(.)test/[id]/new/page.tsx` imported a
missing `./submit-button` module — that unused import was removed, nothing else changed).

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

Then: open `/test` → "Go to /test/new" (intercepted modal) → "Go to /test/[id]" (`/test/42`)
→ "Go to /test/42/new" (intercepted modal) → click **Update Tag**.

## Observed (next dev, Next 16.2.4)

The server action POST `/test/42/new` returns 200, but the client performs a full document
navigation (MPA reload) to `/test/42/new`. Because no non-intercepted `/test/[id]/new` route
exists, the reload renders the 404 page and the modal + detail page are lost.

## Not affected

- Loading `/test/42` directly and opening the modal: `updateTag()` stays a soft update.
- `next build && next start`: soft update, no reload.

Automated scripts (Playwright): `node run.mjs http://localhost:3000 dev` (bug flow),
`node control.mjs http://localhost:3000 dev` (control flow).
