#!/usr/bin/env python3
"""Reproduces vercel/next.js#78118 without a browser.

next/font/google fetches Google Fonts CSS with a hardcoded macOS user agent
(packages/font/src/google/fetch-resource.ts). Google serves unhinted woff2
files for that UA, so every next/font/google TrueType font loses its fpgm /
prep / cvt tables and all per-glyph hinting instructions.

Requires: pip install fonttools brotli
"""
import io
import urllib.request
from fontTools.ttLib import TTFont

CSS = "https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding:wght@700&display=swap"

# Copied verbatim from next/font/google's fetch-resource.ts
NEXT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
)
WINDOWS_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
)


def get(url, ua):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    return urllib.request.urlopen(req).read()


def latin_url(css):
    block = css.split("/* latin */")[1]
    return block.split("url(")[1].split(")")[0]


def report(name, ua):
    css = get(CSS, ua).decode()
    url = latin_url(css)
    data = get(url, ua)
    font = TTFont(io.BytesIO(data))
    instr = sum(
        len(font["glyf"][g].program.getBytecode())
        for g in font["glyf"].keys()
        if getattr(font["glyf"][g], "program", None)
    )
    print(f"[{name}]")
    print(f"  url:   {url}")
    print(f"  bytes: {len(data)}")
    print(f"  hinting tables: " + ", ".join(
        f"{t}={'yes' if t in font else 'NO'}" for t in ("fpgm", "prep", "cvt ")
    ))
    print(f"  glyph hinting instruction bytes: {instr}")
    return instr


if __name__ == "__main__":
    a = report("next/font/google UA (macOS)", NEXT_UA)
    b = report("Windows UA", WINDOWS_UA)
    print()
    print("BUG REPRODUCED" if a == 0 and b > 0 else "not reproduced")
