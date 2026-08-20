# Repro: vercel/next.js#68278

Custom webpack `asset/resource` rule for `.png` overrides Next.js' built-in
`next-image-loader`, so `import img from './car_image.png'` yields a plain URL
string instead of `{src,width,height,blurDataURL}`, and the file is emitted twice.

## Run

```
npm install
npm run dev --  # next dev --webpack
# open http://localhost:3000
```

Dev (`next dev --webpack`) => 500:
`Error: Image with src "/_next/static/<hash>.png" is missing required "width" property.`

Build (`next build --webpack`) => duplicate assets:
`.next/static/media/car_image.<hash>.png` and `.next/static/<hash>.png`,
and the static import value is the string `"/_next/static/<hash>.png"`.

Note: on Next 16 Turbopack is the default; a `webpack` config errors out, so use `--webpack`.
