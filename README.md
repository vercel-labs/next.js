# Repro: sitemap.xml served with `cache-control: public, max-age=0, must-revalidate` (#61616)

## Run
```
npm install
npm run build
npm start
curl -sI http://localhost:3000/sitemap.xml
curl -sI http://localhost:3000/
```

## Observed (next 16.3.1)
- `/sitemap.xml`: `x-nextjs-cache: HIT`, `cache-control: public, max-age=0, must-revalidate`
- `/` (static page): `Cache-Control: s-maxage=31536000`

`export const revalidate = 3600` in `app/sitemap.ts` is applied at build time
(build output shows Revalidate `1h`) but is not reflected in the response
`cache-control` header, so every request hits the server.
