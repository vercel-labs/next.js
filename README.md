# Reproduction: next#56474 — Duplicate rendering with parallel/intercepting routes

The reporter's linked repository (`03k64/nextjs-parallel-routes-bug-repro`) returns 404, so this is a
minimal re-creation.

## Structure

- `app/parent/layout.tsx` renders `children` + the `@modal` slot
- `app/parent/loading.tsx` — loading UI for the segment that owns the slot
- `app/parent/resources/page.tsx` — list of 3 links (artificially slow, 800ms)
- `app/parent/@modal/(.)resources/[id]/page.tsx` — intercepted modal (300ms)

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/parent/resources and click a resource
```

Automated check (server must be running):

```bash
npx playwright install chromium
PORT=3000 node check.mjs
```

## Observed

While the intercepted modal is pending, `app/parent/loading.tsx` is rendered *in addition to* the
still-mounted resources list inside the same `parent` layout, i.e. the segment is rendered twice:

```
{"loading":0,"list":1,"layouts":1,"modal":0}
{"loading":1,"list":1,"layouts":1,"modal":0}   <-- duplicate: loading UI next to existing page
{"loading":0,"list":1,"layouts":1,"modal":1}
```

## Expected

Navigating to the intercepted route should only render the `@modal` slot; the already rendered
`children` should not be replaced/duplicated by the parent `loading.tsx`.

## Workaround (confirmed)

Adding `app/parent/@modal/loading.tsx` returning `null` removes the duplicate loading render.

Reproduced with `next@16.3.1-canary.25` (Turbopack dev) and `next@13.5.5`.
