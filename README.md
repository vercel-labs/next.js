# Repro: path-like strings inlined in `__NEXT_DATA__` (vercel/next.js#40143)

Next.js pages router inlines the full serialized `__NEXT_DATA__` JSON as plain
text in the HTML. Every path-like string in it (the route pattern `page`, and
any prop value that starts with `/`) is scrapeable by naive text-matching
crawlers, which is what the reporter observes in Google Search Console
(e.g. `/post`, `/docs/[[...slug]` reported as internal 404s).

## Run

```bash
npm install
npm run build
npm run start &          # logs the server
npm run verify           # fetches pages and prints scrapeable paths
```

## Observed with next@16.3.1-canary.25

`GET /the-post-slug`:

```
__NEXT_DATA__: {"props":{"pageProps":{"slug":"the-post-slug","canonical":"/post",
"related":["/docs/[[...slug]]","/api/internal/preview"]},"__N_SSP":true},
"page":"/[slug]", ...}
path-like strings a crawler can scrape: "/post", "/docs/[[...slug]]", "/api/internal/preview", "/[slug]"
```

`/post` and `/[slug]` are internal Next.js page identifiers, not valid public
URLs of the site; they are still present verbatim in the served HTML.

Note: the crawler-side half of the report (Google Search Console attributing
these as internal links / soft 404s) cannot be observed in a sandbox; only the
presence of the strings in the HTML payload is verifiable here.
