# next/font/google + `font-feature-settings` (issue #47814)

`font-feature-settings` (e.g. `"ss01" 1`) has no effect on Inter loaded with
`next/font/google`, while the same declaration works on the official Inter build
loaded with `next/font/local`.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
node check-font-features.mjs   # inspects the woff2 files next/font emitted
node verify.mjs                # Chromium pixel comparison, on vs off
```

## Result (next@16.3.1-canary.25, Chromium 151)

```
/_next/static/media/83afe278b6a6bb3c-s.p...woff2   (next/font/google Inter, latin)
  features: calt ccmp dnom frac numr pnum tnum kern mark mkmk
  has ss01: false | has zero: false | has cv05: false

/_next/static/media/InterVariable-s.p...woff2      (next/font/local, inter-ui)
  features: aalt calt case ccmp cv01..cv14 dlig ... ss01 ss02 ... zero kern mark mkmk
  has ss01: true | has zero: true | has cv05: true

google: font-feature-settings has NO effect (identical pixels)
local:  font-feature-settings has an effect (pixels differ)
```

The Google Fonts–hosted/subsetted Inter that `next/font/google` downloads simply
does not contain the stylistic-set / character-variant GSUB features, so
`font-feature-settings: "ss01" 1` cannot apply. Same behavior in `next dev` and
`next build && next start`.
