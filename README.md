# Repro: `__next_metadata_boundary__` resume mismatch (vercel/next.js#92087)

Reproduces on **next 16.2.1 and 16.2.9** (Cache Components / PPR). Fixed on `16.3.1-canary.25`.

## Run

```bash
pnpm install
pnpm build
pnpm start          # watch this terminal
pnpm repro          # in another shell
```

Server log (per request to `/minimal` and `/posts/<slug>`):

```
⨯ Error: Expected the resume to render <div> in this slot but instead it rendered <__next_metadata_boundary__>.
The tree doesn't match so React will fallback to client rendering.
```

The response is HTTP 200 but the server HTML contains **no `<title>`** — the resume is
discarded and metadata is only produced on the client (`pnpm repro` prints `titleInHtml=false`).

## What actually triggers it

* `generateMetadata()` is dynamic (`await connection()`), so the PPR shell is prerendered
  with the *streaming* metadata tree shape (hidden `<div>` wrapper).
* Metadata streaming is disabled for the request (`htmlLimitedBots: /.*/` here; in
  production this is any UA in the default html-limited-bots list), so at request time
  the *blocking* shape (`<__next_metadata_boundary__>`) is rendered → resume aborts.

`"use cache"`, `draftMode()`, `cookies()` and `searchParams` are **not** required:
`app/minimal/page.tsx` has only `generateMetadata` + `connection()` + a `<Suspense>`
dynamic hole and fails identically. Same root cause as #93401.

## Notes on the original report

* The reporter's repo (`lucianobfs/nextjs-use-cache-metadata-boundary-repro`) does not
  build on 16.2.1: `Error: Route "/posts/[slug]": Uncached data was accessed outside of
  <Suspense>`. `app/posts/[slug]/loading.tsx` and the `<Suspense>` around the
  `draftMode()`/`searchParams` subtree were added here to make it build.
* The `ERR_HTTP_HEADERS_SENT` half of the report did not reproduce locally
  (`next start`, cached/stale/draft-mode requests all clean).
