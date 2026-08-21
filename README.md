# Repro: [GoogleMapsEmbed] "directions" mode can't work (vercel/next.js#81591)

```bash
npm install
npm run dev
# then:
curl -s localhost:3000 | grep -o '<iframe[^>]*>'
```

Observed (next@16.3.1, @next/third-parties@16.3.1-canary.26, third-party-capital@1.0.20):

```html
<iframe loading="lazy" src="https://www.google.com/maps/embed/v1/directions?key=CHANGE_ME" ...
  origin="Brooklyn+Bridge,New+York,NY" destination="Paris,France">
```

`origin`/`destination` are emitted as iframe attributes instead of `src` query params, so the
Maps Embed API replies `Invalid request. Missing the 'origin' parameter.`

Cause: third-party-capital's google-maps-embed data allows only
`key, q, center, zoom, maptype, language, region` in the src params list
(directions/streetview/search params such as origin, destination, waypoints, location,
heading, pitch, fov are missing). `packages/third-parties/src/types/google.ts` also omits them.
