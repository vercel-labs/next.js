# Reproduction attempt for vercel/next.js#54485

Redirect source with a trailing dot (`/url.`) claimed to 404 instead of redirecting.

## Run

    npm install
    npm run dev
    curl -i --path-as-is http://localhost:3000/url.

Expected/observed on Next.js canary: `308` to `/url` (dev and `next build && next start`).
