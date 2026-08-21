# Repro: nextjs.org RSS feed has no full post content (issue #92748)

```
node check-feed.mjs
```

Live `https://nextjs.org/feed.xml` items only carry a one-sentence `<description>`
(max ~250 chars) and never a `<content:encoded>` element, even though the
`xmlns:content` namespace is declared on `<rss>`. Feed readers therefore show
summaries only.

Note: the feed is produced by the closed-source nextjs.org site, not by any code
in this repository, so no Next.js app reproduction is possible.
