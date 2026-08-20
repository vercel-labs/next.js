# Reproduction: FOUC in the Next.js emotion example (vercel/next.js#48505)

Minimal copy of `examples/with-emotion` (formerly `with-emotion-swc`) plus one
server-rendered page, running on Next.js canary.

## Root cause shown by this repro

`pages/_app.tsx` creates the emotion cache once at module scope:

```tsx
const cache = createCache({ key: "next" });
```

On the server that module instance is reused for every request. Emotion only
emits an inline `<style data-emotion="...">` tag the first time a serialized
style is inserted into a cache (`cache.inserted`). So only the **first**
server render after the server starts contains the component CSS. Every later
request returns HTML with emotion class names but **no CSS**, so the page paints
unstyled until the client bundle hydrates and re-inserts the styles = FOUC.

Statically prerendered pages (`/`) are unaffected in `next start` because their
HTML is produced once at build time — which is why the report only saw it in
`next dev` (every request is rendered on demand).

## Run it

```sh
npm install

# dev (every request is server-rendered)
npm run dev
node check-fouc.mjs http://localhost:3000/

# production, on-demand rendered page
npm run build && npm start
node check-fouc.mjs http://localhost:3000/ssr
```

Observed output (Next.js 16.3.1-canary.25):

```
request 1: 4 emotion <style> tag(s) -> ["next-global 1uknm52","next 47zubl","next a3xfm8","next f5e8fv"]
request 2: 1 emotion <style> tag(s) -> ["next-global 1uknm52"]
request 3: 1 emotion <style> tag(s) -> ["next-global 1uknm52"]
```

Browser proof (`npm i -D playwright && npx playwright install chromium`,
then `node fouc-playwright.mjs http://localhost:3000/ssr` against a freshly
started server) — first paint of the second request has no styles:

```
request1 firstPaint={"boxShadow":"rgb(144, 238, 144) 5px 5px 0px 0px, ...","color":"rgb(100, 149, 237)","emotionStyleTags":4}
request2 firstPaint={"boxShadow":"none","color":"rgb(0, 0, 0)","emotionStyleTags":1}
request2 hydrated  ={"boxShadow":"rgb(144, 238, 144) 5px 5px 0px 0px, ...","color":"rgb(100, 149, 237)","emotionStyleTags":2}
```

Creating the cache per request (e.g. `useState(() => createCache(...))` /
a fresh cache on the server) makes every response contain the CSS again.
