# Repro for vercel/next.js#74188

The `next.config.js` snippet on https://nextjs.org/docs/messages/next-image-unconfigured-host
includes `search: ''` inside `images.remotePatterns`. Copying it verbatim breaks any remote
image whose `src` contains a query string, and the thrown error blames the *hostname*, which
is misleading.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

`app/page.js` renders the same remote image twice: once without a query string and once with
`?v=1`.

## Observed (Next.js 16.3.1, also 15.x)

The page returns HTTP 500:

```
Error: Invalid src prop (https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png?v=1)
on `next/image`, hostname "assets.vercel.com" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```

Direct optimizer requests:

```
GET /_next/image?url=<png>       -> 200
GET /_next/image?url=<png>%3Fv%3D1 -> 400 ("url parameter is not allowed")
```

Removing `search: ''` (as the reporter did) makes both requests succeed.

## Observed on Next.js 14.2.5

`search` is not a valid key at all, so startup prints:

```
Invalid next.config.js options detected:
    Unrecognized key(s) in object: 'search' at "images.remotePatterns[0]"
```

## Expected

The docs should not suggest `search: ''` (nor `port: ''`) as boilerplate, since an empty
`search` opts out of *all* query strings, and it is unsupported on Next.js 14.
