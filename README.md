# Repro: 404 after on-demand revalidation with `dynamicParams = false` (issue #58137)

Repaired/refreshed version of https://github.com/better-salmon/404-after-on-demand-revalidation
(the original fetched `worldtimeapi.org`, which is no longer reliable; a tiny local JSON
server on port 4000 is used instead).

Verified on `next@16.3.1-canary.25` (also on `14.0.2-canary.18`).

## Run

```bash
npm install
node data-server.mjs &        # local data source on :4000
npm run build && npm start
curl -i http://localhost:3000/should-work                                 # 200
curl "http://localhost:3000/api/revalidate?type=path&revalidate=/should-work"
curl -i http://localhost:3000/should-work                                 # 404, permanently
```

Setting `dynamicParams = true` in `app/[slug]/page.tsx` makes revalidation work,
proving the 404 comes from the `dynamicParams = false` path check. The server logs
`Error: Internal: NoFallbackError` for every request after revalidation.

On 14.0.2-canary.18 both `revalidateTag` and `revalidatePath` produced the 404; on
16.3.1-canary.25 tag revalidation recovers but `revalidatePath` still 404s.
