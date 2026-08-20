# Repro: unused client component pulled into first-load JS via barrel file (#49742)

App Router. `app/components/index.js` is a barrel that `export *`s two client
components. `app/page.js` (Server Component) imports only `ComponentA`, but the
unused `ComponentB` still ends up in the page's first-load client chunk.

Each component contains a unique marker string so the result is unambiguous.

## Run

```bash
npm install
npx next build --webpack   # or: npx next build (Turbopack)
grep -rl MARKER_COMPONENT_B_IS_UNUSED .next/static
```

Expected: no match (ComponentB is never imported/rendered).
Actual: matches `.next/static/chunks/app/page-*.js` — the chunk that the page
loads with `<script>` on first load.

Comment out `export * from "./ComponentB";` in `app/components/index.js`, or
import `./components/ComponentA` directly, and the marker disappears.

Verified with next@16.3.1-canary.25 on both Turbopack and webpack.
