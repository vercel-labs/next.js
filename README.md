# Reproduction: preloaded CSS not used within a few seconds (vercel/next.js#51524)

App Router page with a `<Link>` to a route that has a CSS module. Prefetching on
hover injects `<link rel="preload" as="style">` for the target route's stylesheet;
because navigation does not happen, Chrome logs:

> The resource .../_next/static/css/app/child/page.css was preloaded using link
> preload but not used within a few seconds from the window's load event.

## Run

```
npm install
npm run dev   # http://localhost:3000, open Chrome DevTools console, hover the link
```

Also reproducible in production: `npm run build && npm start`.
