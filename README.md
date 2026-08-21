# Repro: vercel/next.js#77447 — `@next/third-parties` YouTubeEmbed has no way to mute for `autoplay=1`

## Run

```bash
npm install
npm run dev   # http://localhost:3000
# optional automated DOM check (needs `npx playwright install chromium`)
node check.mjs
```

## Cases on the page

1. `<YouTubeEmbed params="autoplay=1" />`
2. `<YouTubeEmbed params="autoplay=1&mute=1" />`
3. plain `<iframe src="...?autoplay=1&mute=1">` (control)
4. `<YouTubeEmbed params="autoplay=1" muted />` (`muted` is not part of the public type)

## Observed (Next.js 16.3.1, @next/third-parties 16.3.1 (also verified on 15.3.0), Chromium with `--autoplay-policy=no-user-gesture-required`)

* Cases 1, 2, 4 render only `<lite-youtube ...>` with a poster + play button; `iframe` count is `0` on load, so nothing can autoplay. The control iframe (case 3) loads and plays immediately.
* Only after a user click does lite-youtube create the iframe:
  * case 1 -> `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&autoplay=1&playsinline=1` (note duplicated `autoplay=1`)
  * case 2 -> `...?autoplay=1&mute=1&autoplay=1&playsinline=1` (so `mute=1` does pass through `params`, but only post-click)
* `muted` in case 4 is forwarded to `<lite-youtube muted="">` as an inert attribute and never reaches the iframe URL.
* `YouTubeEmbed` type in `packages/third-parties/src/types/google.ts` is `{height,width,videoid,playlabel,params,style}` — no `muted`.
