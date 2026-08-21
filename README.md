# Reproduction: next.js#94807 — cms-wordpress docs demo is missing images

The Pages Router docs link a WordPress demo (`https://next-blog-wordpress.vercel.app/`)
in three places:

- `docs/02-pages/02-guides/preview-mode.mdx`
- `docs/02-pages/03-building-your-application/02-rendering/02-static-site-generation.mdx`
- `docs/02-pages/03-building-your-application/03-data-fetching/index.mdx`

The demo still renders, but every post cover image is blank because its WordPress
origin `vercelsolutions.com` is no longer under Vercel control: it now resolves to an
unrelated AWS host serving a certificate for `*.api.validusarm.com`.

Live demo evidence:

```
GET https://next-blog-wordpress.vercel.app/_next/image?url=https%3A%2F%2Fvercelsolutions.com%2F...jpg&w=3840&q=75
-> 404 (x-vercel-error: NOT_FOUND)

GET https://next-blog-wordpress.vercel.app/_next/image?url=https%3A%2F%2Fsecure.gravatar.com%2F...&w=3840&q=75
-> 200 (author avatars still load)
```

This repo reproduces the same upstream failure on current Next.js canary with the exact
image URLs used by the demo.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Expected

Both images render.

## Actual

- Cover image (`vercelsolutions.com`): `/_next/image` responds **500** and the `<img>` has
  `naturalWidth === 0`. Server log:
  `Error: Hostname/IP does not match certificate's altnames: Host: vercelsolutions.com. is not in the cert's altnames: DNS:*.api.validusarm.com`
- Avatar (`secure.gravatar.com`): **200**, renders fine.

The deployed demo returns 404 instead of 500 because it runs a much older Next.js on
Vercel's image optimizer, but the cause is the same dead WordPress origin.
