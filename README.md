# Repro attempt: "Poppins font displayed badly on iOS" (vercel/next.js#54776)

The original issue links to https://perdu.com (not a reproduction). This app is a
minimal, self-contained comparison built to test the claim.

Pages:
- `/` – Poppins via `next/font/google` at weights 100–500.
- `/compare` – same text rendered side by side: left column = `next/font/google`
  Poppins, right column = the *same* Poppins family fetched at request time from
  `fonts.googleapis.com/css2` (with an iOS Safari UA) and renamed to
  `PoppinsGoogle`, so both paths render in one page.
- `/varcheck` – dumps the objects returned by `Poppins()` with and without the
  `variable` option (relates to the "poppins.variable is undefined" comment).

Run:

    npm install
    npm run build && npm start
    # then open /compare (on an iPhone for the reported platform)

Automated check (Playwright WebKit = same engine as iOS Safari):

    npx playwright install webkit chromium
    node shot2.mjs   # screenshots each row for both sources

Result on Next.js 16.3.1-canary.25: the per-weight woff2 self-hosted by
`next/font` is byte-identical to the file `fonts.gstatic.com` serves
(md5 43751174b6b810eb169101a20d8c26f8 for latin/400), and the per-row
screenshots of the two columns are pixel-identical in WebKit and Chromium.
