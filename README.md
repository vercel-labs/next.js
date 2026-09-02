# Repro: Turbopack panic in `next-code-frame` (issue #98178)

`next build` (Turbopack) panics while rendering a code frame instead of printing the
diagnostic:

```
thread 'tokio-rt-worker' panicked at crates/next-code-frame/src/highlight.rs:1021:45:
end byte index 94 is not a char boundary; it is inside '히' (bytes 93..96 of string)

> Build error occurred
[Error: Panic in async function]
```

## Run

```bash
npm install
npm run build          # Turbopack -> panic, diagnostic destroyed
npm run build:webpack  # webpack   -> prints the real error (Module not found)
```

## Conditions

`app/page.tsx` contains:

1. A real diagnostic that renders a code frame (`import missing from './does-not-exist'`, line 2).
2. A multi-line template literal starting inside the code-frame window (line 3).
3. A long non-ASCII (Korean) line as the **last** line of the code-frame window (line 5),
   long enough that the frame is truncated.

## Why it panics

`extract_highlights` builds per-line visible byte ranges with raw byte arithmetic
(`ls + trunc_offset + avail_width`, `crates/next-code-frame/src/highlight.rs`), and
`scan_template` emits `add_span(seg_start, scan_end, TokenType::String)` with that raw
`scan_end`. For a template literal that is not closed before `scan_end`, the resulting
span end lands *inside* a multi-byte character, and
`apply_line_highlights` slices `&visible_content[display_start..display_end]`
(highlight.rs:1021) without checking `is_char_boundary` -> panic.

Regex-literal spans (`re_match.end().min(scan_end)`) have the same raw-byte clamp.
Ordinary comments/strings do not hit it because the UTF-8-aware regex engine already
floors match ends to char boundaries.

Reproduced with `next@16.3.4` and `next@16.4.0-canary.14` on Linux/Node 24
(the reporter saw it on Windows with a warning-level frame; the panicking slice is shared
by all code frames).
