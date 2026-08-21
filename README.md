# Repro attempt for vercel/next.js#93144

"Turbopack build fails 'Failed to collect page data' on CMS-fed sitemap.xml (works with --webpack)"

Next 16.2.3 / React 19.2.4 app with `app/sitemap.ts`, `app/rss.xml/route.ts`,
`app/llms.txt/route.ts` fed by `next-sanity@10.1.4`, plus `@xyflow/react`,
`framer-motion@12.38.0` and `dagre@0.8.5` on a client page (`/admin/jornada`),
mirroring the dependency set described in the issue.

## Run

```bash
pnpm install
pnpm build           # Turbopack (default)
pnpm build:webpack   # webpack
```

## Result (Node 24, Linux)

Both bundlers succeed. The reported Turbopack-only failure did not reproduce.

To see the *only* way we could produce `Failed to collect page data for /sitemap.xml`
with the `instantiateRuntimeModule` stack frame, unset the Sanity env config so that
`createClient()` throws while the module is evaluated:

```bash
# in sanity.ts, drop the `|| 'abcdefgh'` / `|| 'production'` fallbacks
pnpm build           # Error: Configuration must contain `projectId` -> Failed to collect page data
pnpm build:webpack   # same error, same failing route -> not Turbopack specific
```
