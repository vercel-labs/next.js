# Repro: App Router ISR keeps `<meta name="robots" content="noindex">` (and 404 status) after revalidation

Issue: https://github.com/vercel/next.js/issues/71440

`app/posts/[id]/page.js` is prerendered with `generateStaticParams` + `revalidate = 5`.
It fetches a post status from a tiny backend (`server.js`, port 3041) and calls `notFound()`
when the post is not published. `state.json` is the mutable "database".

## Run

```bash
npm install
npm run repro          # fully automated: build, start, flip state, probe
```

or manually:

```bash
npm install
npm run server        # terminal 1 - backend on :3041
npm run build && npm start   # terminal 2 - Next.js on :3040
# 1. curl -i localhost:3040/posts/abc            -> 200, no robots tag
# 2. echo '{ "status": "draft" }' > state.json ; wait 6s; request twice
#    -> 404 with <meta name="robots" content="noindex"/>
# 3. echo '{ "status": "published" }' > state.json ; wait 6s; request repeatedly
#    -> body is the published page again, but the response is STILL 404 and STILL
#       contains <meta name="robots" content="noindex"/>
# 4. cat .next/server/app/posts/abc.html | grep noindex   -> still present
#    cat .next/server/app/posts/abc.meta                  -> {"status":404,...}
```

## Observed (next 15.3.1, node 24)

```
== baseline (published)   http=200 noindex=0 published=1
== draft                  http=404 noindex=1 published=0
== published again        http=404 noindex=1 published=1   <-- stuck, indefinitely
```

The cached `.meta` keeps `"status":404` and `x-nextjs-stale-time: 4294967294`, so the
entry never recovers until `.next` cache is cleared.

On `next@16.3.1-canary.25` the entry recovers after one extra revalidation cycle, but
there is still a window where a `200` response is served with the `noindex` meta tag.
