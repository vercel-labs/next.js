# Repro: Next.js sitemap does not XML-escape `&`, `<`, `>` in generated sitemap

Issue: https://github.com/vercel/next.js/issues/80430

1. `npm install`
2. `npm run dev`
3. `curl http://localhost:3000/sitemap/1.xml`

`app/sitemap.ts` returns a video title containing `&` plus an image URL with `&`.
Next.js emits them raw, producing invalid XML:

```
<image:loc>https://example.com/img.jpg?a=1&b=2</image:loc>
<video:title>MD0186 肉【钟宛冰&苏语棠】</video:title>
<video:description>a & b < c > d "quoted"</video:description>
```

Browsers/XML parsers reject it: `EntityRef: expecting ';'` (line 6).
Reproduced with next@16.3.1-canary.26.
