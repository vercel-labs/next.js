# Repro: no `<link rel="preload" as="style">` for CSS chunks (next#93153)

Mirror of the zip attached to https://github.com/vercel/next.js/issues/93153
(default `create-next-app` app-router project, Next 16.2.4).

## Run

```bash
npm install
npm run build
npm start
# then:
curl -s http://localhost:3000/ | grep -o '<link[^>]*>'
```

## Observed (both Turbopack and `--webpack` builds)

The document head contains preloads for fonts, images and scripts, but the CSS
chunk is only emitted as a render-blocking stylesheet with no preload:

```html
<link rel="preload" href="/_next/static/media/...woff2" as="font" ... />
<link rel="preload" as="image" href="/next.svg"/>
<link rel="stylesheet" href="/_next/static/chunks/0536d~goln0zt.css" data-precedence="next"/>
<link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/...js"/>
```

`grep -c 'as="style"'` returns `0`.

## Expected

```html
<link rel="preload" href="/_next/static/chunks/0536d~goln0zt.css" as="style"/>
<link rel="stylesheet" href="/_next/static/chunks/0536d~goln0zt.css" data-precedence="next"/>
```
