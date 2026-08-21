# Reproduction: vercel/next.js#78302

Turbopack (lightningcss) drops the standard `backdrop-filter` declaration when it
is written *before* `-webkit-backdrop-filter`.

```
npm install
npm run dev        # Turbopack -> broken
npm run check      # prints served CSS
```

`app/globals.css` source:

```css
.bad  { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.good { -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
```

Turbopack dev output (next 15.3.1 and 16.3.1):

```css
.bad  { -webkit-backdrop-filter: blur(10px); ... }   /* standard prop gone */
```

`npm run dev:webpack` (webpack dev) keeps both declarations in both rules.
With next 16.3.1, `next build` (Turbopack) also drops it.
