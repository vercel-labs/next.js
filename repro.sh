#!/usr/bin/env bash
# Reproduces vercel/next.js#67623: with output: 'standalone', if the sharp
# platform binary bundled at build time does not match the runtime platform
# (glibc build -> alpine/musl container, or cross-platform install), the image
# optimizer silently falls back to the ORIGINAL image, so responsive resizing
# stops working in production while it works in `next dev`.
set -eu
PORT="${PORT:-3100}"
OUT=/tmp/next-67623-standalone

npx next build
rm -rf "$OUT"
cp -r .next/standalone "$OUT"
cp -r public "$OUT/"
cp -r .next/static "$OUT/.next/"
rm -rf "$OUT/.next/cache"

# Simulate the platform mismatch seen in Docker (alpine/musl runtime):
# the platform-specific sharp binary bundled by the build trace is unusable.
rm -rf "$OUT"/node_modules/@img/sharp-lin* "$OUT"/node_modules/@img/sharp-libvips-lin*

(cd "$OUT" && PORT="$PORT" node server.js > /tmp/next-67623-server.log 2>&1 &)
sleep 8
echo "--- request /_next/image?url=/big.jpg&w=640&q=75 (source image is 2000x1200) ---"
curl -s -D - -o /tmp/next-67623-image.jpg "http://localhost:$PORT/_next/image?url=%2Fbig.jpg&w=640&q=75" | head -12
echo "--- bytes returned: $(wc -c < /tmp/next-67623-image.jpg) (original big.jpg is $(wc -c < public/big.jpg) bytes) ---"
echo "--- server log ---"
cat /tmp/next-67623-server.log
