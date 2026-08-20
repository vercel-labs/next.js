# Repro: next.config headers() not applied to trailingSlash 308 redirect (vercel/next.js#66352)

Reporter's repo (tippfelher/nextjs-redirect-issue) is deleted (404), so this is a minimal rebuild.

```bash
npm install
npm run build
npm start            # http://localhost:3000
curl -sSI http://localhost:3000/something    # 200 + Access-Control-Allow-Origin: *
curl -sSI http://localhost:3000/something/   # 308, NO Access-Control-Allow-Origin
node cors-check.mjs  # browser fetch: /something ok, /something/ FAILED: Failed to fetch
```

`headers()` matches `/:path*`, but the internal trailing-slash normalization 308 response
carries none of the configured headers, so a cross-origin browser fetch to `/something/`
fails CORS before the redirect is followed.
