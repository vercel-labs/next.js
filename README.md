# Reproduction: `next/font/google` 404 on a font file → "Module not found", no retry

Issue: https://github.com/vercel/next.js/issues/97376

The reporter could not make the *trigger* (a stale Google Fonts stylesheet pointing at
rotated-away `fonts.gstatic.com` files) deterministic. The *handling* is deterministic and
that is what this repro pins down: any non-2xx on the font file becomes an unresolvable
module, the HTTP status is only a warning, and a 404 is never retried.

The stylesheet response is injected with `NEXT_FONT_GOOGLE_MOCKED_RESPONSES`, the same hook
Next.js' own e2e tests use (`crates/next-core/src/next_font/google/mod.rs`, `get_mock_stylesheet`).
Only the stylesheet is mocked; the **font file fetch is the real code path** under test
(`NextFontGoogleFontFileReplacer::result` → `fetch_from_google_fonts`).

```
npm install
```

## A. Real, permanently dead gstatic URL (the exact URL from the issue, still 404 today)

```
NEXT_FONT_GOOGLE_MOCKED_RESPONSES=$PWD/google-font-mocked-responses.js npx next build
```

## B. Fully local, offline, and counts the attempts

```
node mock-font-server.js &                    # 404s every request, prints a hit counter
NEXT_FONT_GOOGLE_MOCKED_RESPONSES=$PWD/google-font-mocked-responses.local.js npx next build
kill %1                                       # prints total requests
```

Expected (broken) output, identical on 16.3.1 and 16.3.1-canary.16:

```
Turbopack build encountered 1 warning:
[next]/internal/font/google/93676ef79bc849ec-s.woff2
Warning: Error while requesting resource
Received response with status 404 when requesting http://127.0.0.1:4949/notoserif-latin-400.woff2

> Build error occurred
Error: Turbopack build failed with 1 error:
[next]/internal/font/google/noto_serif_56bec3b7.module.css:7:8
Error: Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

`[mock-gstatic] total requests for the font file: 1` → no retry.

With `MOCK_STATUS=500 node mock-font-server.js` the counter shows **2** requests
(`FetchClientConfig { max_retries: 1 }` retries connect/timeout/5xx only), and the build still
fails with the same `Module not found` error, so the retry that exists does not cover 404 and
the reported cause is still hidden in a warning.
