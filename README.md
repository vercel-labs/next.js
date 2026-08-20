# Repro: `unstable_noStore()` placement in async pages with PPR (issue #58443)

Reproduction for https://github.com/vercel/next.js/issues/58443 (docs request:
"noStore on async server rendered pages with PPR enabled").

Pinned to the exact version named in the issue: `next@14.0.3-canary.7` with
`experimental.ppr: true`.

## Run

```bash
npm install --legacy-peer-deps
npx next build
```

## Routes

| Route            | Where `noStore()` is called                       | Result on 14.0.3-canary.7 |
| ---------------- | ------------------------------------------------- | ------------------------- |
| `/inside`        | first line of the async page component (as docs)  | builds fine, page is `λ` (dynamic) |
| `/delayed`       | before an `await` of a slow async helper           | builds fine, `λ` |
| `/after-await`   | after an `await` inside the async page             | builds fine, `λ` |
| `/nested-async`  | inside an async helper awaited by the page         | builds fine, `λ` |
| `/toplevel`      | module scope (the issue's "correct implementation")| builds fine but page is `○` (STATIC — noStore has no effect) |
| `/try-catch`     | inside a user `try { } catch { }`                  | **build fails** with the error quoted in the issue |

`/try-catch` output:

```
⨯ Prerendering /try-catch needs to partially bail out because something dynamic was used.
React throws a special object to indicate where we need to bail out but it was caught by a
try/catch or a Promise was not awaited. ... https://nextjs.org/docs/messages/ppr-caught-error
Export encountered errors on following paths:
	/try-catch/page: /try-catch
```

Delete `app/try-catch` and the build succeeds, showing every other placement
(including the documented one) is fine.

## Notes for modern Next.js

On `next@16.3.1-canary.25` with `cacheComponents`, `unstable_noStore()` is a no-op:
all of these routes prerender statically and no error is emitted (`unstable_noStore`
is deprecated in favor of `await connection()`).
