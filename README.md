# Repro: next/font/google ships unhinted font files (jagged edges) — vercel/next.js#51540

`next/font/google` fetches the Google Fonts CSS/woff2 with a **hardcoded macOS Chrome
User-Agent** (`packages/font/src/google/fetch-resource.ts`). Google Fonts serves
**unhinted** woff2 to macOS UAs and **hinted** woff2 (containing the `prep`, `fpgm` and
`cvt ` TrueType hinting tables) to Windows UAs. The self-hosted file therefore has no
hinting, so on Windows (DirectWrite honours TT hinting) the text rasterizes differently /
"jagged" compared to the same font loaded through `<link href="fonts.googleapis.com/css2...">`.

## Run

```bash
npm install
npx playwright install chromium
npm run fonts   # downloads the same latin subset with both UAs, prints hinting tables
npm run dev     # in another shell
npm run compare # pixel-diffs next/font output vs the hinted Windows file
```

`npm run fonts` output (canary, Aug 2026):

```
lato       nextfont-ua   13980 bytes  hinting=NONE   S6uyw4BMUTPHjx4wXiWtFCc.woff2
lato       windows-ua    23580 bytes  hinting=prep,fpgm,cvt    S6uyw4BMUTPHjx4wXg.woff2
ubuntu     nextfont-ua   14088 bytes  hinting=NONE   4iCs6KVjbNBYlgoKfw72nU6AFw.woff2
ubuntu     windows-ua    34924 bytes  hinting=prep,fpgm,cvt    4iCs6KVjbNBYlgoKfw72.woff2
open-sans  nextfont-ua   42964 bytes  hinting=NONE   memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2
open-sans  windows-ua    48320 bytes  hinting=prep,fpgm,cvt    memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2
```

`/` renders each font three times: via `next/font/google`, via the raw unhinted file and via
the raw hinted file. `next/font/google` is byte-identical to the unhinted file (0 differing
pixels) and differs from the hinted file at 15–17px.
