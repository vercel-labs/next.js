# Repro: vercel/next.js#67704 — unused (unrendered) client component CSS + JS shipped to page

Reporter's linked repo (https://github.com/G3EORG3E/multi-tenant) is 404/private, so this is a minimal recreation.

`app/components/Header.js` is a server component that `next/dynamic`-imports two client
components (`ModernHeader`, `MinimalisticHeader`) and only ever renders `ModernHeader`.

## Run

    npm install
    npm run build && npm start   # http://localhost:3000
    # Turbopack (default): page HTML links BOTH css chunks
    curl -s localhost:3000 | grep -o '[^"]*\.css'

    npx next build --webpack && npx next start -p 3001
    # webpack: single page css contains both MODERN_CSS_MARKER and MINIMALISTIC_CSS_MARKER

Also: the page's JS chunk contains `MINIMALISTIC_HEADER_MARKER`, i.e. the unrendered
client component is bundled/downloaded too.
