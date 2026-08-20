# next#72810 — query string stripped from `alternates.canonical` / `alternates.languages`

Reproduction of https://github.com/vercel/next.js/issues/72810, pinned to `next@15.5.7`
(the reporter's original repo used `next: canary`, which now resolves to 16.x where the bug is fixed).

## Run

```
npm install
npm run dev
curl -s http://localhost:3000/ | grep -oE '<link rel="(alternate|canonical)"[^>]*>'
```

## Actual (next@15.5.7)

```
<link rel="canonical" href="http://localhost:3000"/>
<link rel="alternate" hrefLang="x-default" href="http://localhost:3000"/>
<link rel="alternate" hrefLang="en" href="http://localhost:3000"/>
<link rel="alternate" hrefLang="ko" href="http://localhost:3000"/>
```

## Expected (and actual with next@16.3.1)

```
<link rel="canonical" href="http://localhost:3000/?hl=ko_KR"/>
<link rel="alternate" hrefLang="x-default" href="http://localhost:3000"/>
<link rel="alternate" hrefLang="en" href="http://localhost:3000/?hl=en_US"/>
<link rel="alternate" hrefLang="ko" href="http://localhost:3000/?hl=ko_KR"/>
```

Only the root path `/` is affected: `?hl=en_US` on a non-root path such as `/about?hl=en_US`
is preserved even on 15.x.

Fixed upstream by commit bc14f1928b (PR #78262), first tagged in `v15.6.0-canary.33`
and shipped in `16.0.0`; not backported to the 15.5.x line.
