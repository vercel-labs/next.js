# Reproduction attempt for vercel/next.js#75836

"sitemap in google search console says Couldn't fetch"

Minimal App Router app with `app/sitemap.ts`, `app/robots.ts` and a pass-through
`middleware.ts` (matcher `/:path*`, as in the reporter's app).

```bash
npm install
npm run build && npm start   # then: curl -i http://localhost:3001/sitemap.xml
npm run dev                  # then: curl -i http://localhost:3000/sitemap.xml
```

Expectation from the issue: sitemap unreachable / malformed.
Actual: Next.js returns HTTP 200, `content-type: application/xml`, valid
`<urlset>` XML in dev, in `next start`, and on Vercel — including with a
Googlebot user agent and with middleware active. The reporter's own live
deployment also returns 200 `application/xml`. The failure is on the Google
Search Console side (delayed/cached crawl), not in Next.js output.
