# Reproduction for vercel/next.js#77864

False positive "Server Actions must be async functions." when a `'use server'` file exports the
result of a builder-pattern chain containing a non-async arrow function inside an argument
(e.g. `Object.entries(x).map(([k]) => k)` inside `.schema(...)`).

The reporter's original repo (ChristianIvicevic/debug) is no longer public, so this is a minimal
re-creation without third-party libraries.

## Run

    npm install
    npm run dev   # next dev --turbopack
    # open http://localhost:3000

Expected: page renders. Actual (next 15.2.4 and 15.5.23): compile error

    ./app/actions.ts
    Server Actions must be async functions.
    > things: Object.entries(things).map(([kind]) => kind),

Also reproduces with webpack (`npm run dev:webpack`), so it is not Turbopack-specific.
Does NOT reproduce on next@canary (16.3.1-canary.26) - appears fixed there.
