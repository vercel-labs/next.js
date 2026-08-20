# Repro: next.js#55559 — mdxRs double-encodes `&` in markdown URLs

```
npm install
MDX_RS=1 npm run dev   # broken: src="...?param1=value1&amp;amp;param2=value2"
npm run dev            # correct: src="...?param1=value1&amp;param2=value2"
```

Open http://localhost:3000 and view source (or `curl -s localhost:3000 | grep example.com`).

With `experimental.mdxRs: true`, `&` inside markdown-syntax image/link URLs is
HTML-escaped twice, so the rendered attribute contains a literal `&amp;`
instead of `&`. JSX attributes written inline (`<img src="...&b=2" />`) are
unaffected. Verified on next 16.3.1.
