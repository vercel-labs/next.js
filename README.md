# Reproduction attempt for vercel/next.js#56441

Issue: "Uncaught Error: Minified React error #425, #418, #423 and #329 in production"
Reported case: an App Router page component returning an array of strings that contain `\n`,
which is said to hydrate fine locally but fail when deployed to Vercel.

## Run

```bash
npm install
npm run build && npm run start   # then open http://localhost:3000
```

`app/page.tsx` is the exact snippet from the issue. `pages-router/index.tsx` is the
equivalent Pages Router page used by the reporter's CodeSandbox (copy it to `pages/index.tsx`
and delete `app/` to test that variant).

## Result

No hydration error was observed in any configuration:

- Next.js 16.3.1-canary.25, `next build && next start` locally: clean console.
- Same app deployed to Vercel (production build): clean console, no React #418/#423/#425/#329.
- Next.js 13.5.4 + React 18.2.0 (version current when the issue was filed), locally and on Vercel: clean console.
- Pages Router variant on canary: clean console.

Server HTML in every case is `Service and protection<!-- -->Help when you need it<!-- -->Complimentary member benefits`,
i.e. React inserts `<!-- -->` separators between the adjacent text nodes and hydration matches.
