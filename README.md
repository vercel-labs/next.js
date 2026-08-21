# Repro: Turbopack breaks swagger-ui-react (vercel/next.js#86507)

    npm install
    npm run dev   # open http://localhost:3000

Browser console (Turbopack):

    TypeError: ...OpenApi3_1Element.refract is not a function
        at Object.normalize (node_modules_swagger-client_es_*.js)

Works with `npm run dev:webpack` (no console error).

Cause: `@swagger-api/apidom-ns-openapi-3-1` declares `src/refractor/registration.mjs`
as its only side-effectful file and re-exports it from the `index.mjs` barrel.
Turbopack's barrel-file optimization drops that module, so the
`XxxElement.refract = createRefractor(...)` assignments never run.
Reproduced with next@16.0.4 and next@16.3.1-canary.26. See PR #86584.
