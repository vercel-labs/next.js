# Repro attempt: vercel/next.js#82155 — `vercel build` fails with "Unable to find lambda for route: /admin/archive"

Reporter's repo (https://github.com/Bruh-Codes/payless4tech) is private/deleted, so this is a
minimal app mirroring the route tree from the issue log (app router, force-dynamic /admin/*,
dynamic segments, route handlers, sitemap/robots/manifest metadata routes).

## Run
    npm install
    mkdir -p .vercel && echo '{"projectId":"prj_local","orgId":"team_local","settings":{"framework":"nextjs"}}' > .vercel/project.json
    VERCEL_ORG_ID=team_local VERCEL_PROJECT_ID=prj_local npx vercel build --yes

## Result on Linux (Node 24.17.0, next 15.4.4, Vercel CLI 44.6.3)
Build completes: "Created all serverless functions" + "Build Completed in .vercel/output".
No "Tracing entries due to missing build traces" and no NEXT_MISSING_LAMBDA error.
Also tried: `next build --turbopack`, `outputFileTracing: false`, edge runtime + revalidate on
/admin/archive, and an empty `node_modules/@types/minimatch` (for the reported
"Cannot find type definition file for 'minimatch'") — none reproduce.

The reported error string `Unable to find lambda for route:` is thrown by the @vercel/next
builder (code NEXT_MISSING_LAMBDA), not by `next build`, which the reporter confirms succeeds.
Reporter is on Windows 11 / yarn 1, so the failure looks Windows-specific to the builder.
