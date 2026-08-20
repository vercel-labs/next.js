# Reproduction attempt for vercel/next.js#47533

"Fast Refresh performing a full reload when there is a client component + tailwind"

App Router + Tailwind + a `'use client'` component, with `globals.css` (containing the
`@tailwind` directives) imported from `app/layout.js`.

## Run

```bash
npm install
npm run dev            # Turbopack (default)
# or: npx next dev --webpack
node check2.js out     # edits server page / client component / globals.css
node check3.js out2    # swaps a Tailwind class in the client component
```

Each harness sets `window.__marker` and increments client state, edits a file, waits for the
change to be visible, and then checks whether the marker/state survived. `marker=undefined`
or a `load` event means the page was fully reloaded.

## Result on next@16.3.1-canary.25 (Node 24)

Every edit (server component, client component, `globals.css`, and Tailwind class changes that
force a new utility to be generated) hot-updated with `window.__marker=kept`, client state
preserved and zero `load` events, under both Turbopack and webpack.

On next@14.2.14 the page also never reloaded; client component edits only occasionally
remounted the component (state reset to 0, marker kept).
