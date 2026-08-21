# Repro: vercel/next.js#95107 — `dynamicParams: false` unsupported with `cacheComponents`

Next.js `16.3.0-canary.62`, Node 24.

## Run

    cd cache-components && npm install && npx next build
    cd ../baseline && npm install && npx next build

## Observed (cache-components/, `cacheComponents: true`)

    └   /[slug]
      ├ ◐ /[slug]          <-- dynamic PPR fallback route exists
      ├ ○ /grove
      ├ ○ /mediated-matter
      └ ○ /out-here-archery

`next start` + `curl -i /does-not-exist` => HTTP 200,
`x-nextjs-postponed: 1`, `Cache-Control: private, no-cache, no-store` — every
request for an unknown slug is a server render (function invocation), and the
`notFound()` in the page cannot even produce a 404 status because the PPR shell
was already flushed.

Adding `export const dynamicParams = false` fails the build:

    Error: Route segment config "dynamicParams" is not compatible with `nextConfig.cacheComponents`. Please remove it.

## Expected (baseline/, no `cacheComponents`, `dynamicParams = false`)

    └   /[slug]
      ├ ● /grove
      ├ ● /mediated-matter
      └ ● /out-here-archery

No `/[slug]` fallback route; unknown slugs are served as a static 404.
