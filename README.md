# Repro: metadataBase ignored in dev mode (vercel/next.js#54349)

```
npm install
npm run dev            # port 8082
curl -s http://localhost:8082/ | grep -o 'property="og:image" content="[^"]*"'
# dev  -> http://localhost:8082/opengraph-image.png?...   (metadataBase ignored)

npm run build && npm start
curl -s http://localhost:8082/ | grep -o 'property="og:image" content="[^"]*"'
# prod -> https://example.com/opengraph-image.png?...     (metadataBase respected)
```
`app/layout.js` sets `metadataBase: new URL('https://example.com')`.
Sending a different `Host:` header in dev does not change the URL either.
