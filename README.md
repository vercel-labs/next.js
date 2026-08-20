# Verification repro for vercel/next.js#52165

Globals in the app directory across HMR / repeated requests (dev mode).

    npm install
    npm run dev        # Turbopack; add --webpack for webpack
    curl localhost:3000/exact   # then edit app/exact/page.js and curl again

Result on next@16.3.1-canary.25 (Node 24): `global._foo` is preserved across
HMR edits and requests in app pages, app route handlers (including dynamic
segments) and pages/api — all in the same process. Only `runtime = "edge"`
routes lose globals after an edit, because the edge sandbox is recreated.
