# Repro: next build panics in next-code-frame on non-ASCII source (vercel/next.js#97782)

`next build` (Turbopack) aborts with a Rust panic instead of printing the build/validation
errors when the offending source line contains non-ASCII characters (e.g. Cyrillic)
inside the horizontally truncated code-frame window.

## Run

```bash
npm install
npx next build
```

## Observed (Next.js 16.3.0 and 16.4.0-canary.3)

```
thread 'tokio-rt-worker' panicked at crates/next-code-frame/src/highlight.rs:1021:45:
end byte index 96 is not a char boundary; it is inside 'л' (bytes 95..97 of string)

> Build error occurred
[Error: Panic in async function]
```

Zero validation errors are printed.

## Expected

The "Route segment config \"dynamic\" is not compatible with `nextConfig.cacheComponents`"
errors are printed with a code frame, as `next dev` does.

## Notes

- `cacheComponents` is not required: any Turbopack build error whose code frame is
  horizontally truncated over non-ASCII text panics the same way (e.g. an unresolved import
  on a long Cyrillic line).
- The panic is in `apply_line_highlights` (`crates/next-code-frame/src/highlight.rs`):
  the visible window / token span end is a byte offset that can land inside a multi-byte
  character, and `&visible_content[display_start..display_end]` then panics.
- Whether it triggers depends on the parity of the byte offsets of the truncation window
  edges, hence the four `app/v0..v3` pages with 1-byte shifts, so that at least one hits
  the boundary for common terminal widths (this sandbox renders code frames at width 100).
