#!/bin/bash
# Reproduce on Linux (case-sensitive FS) by mounting this repo through a
# case-insensitive FUSE passthrough, which mimics macOS/Windows behavior.
#
#   sudo apt-get install -y fuse3 libfuse3-dev gcc pkg-config
#   ./linux-case-insensitive-harness/run.sh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$(cd "$HERE/.." && pwd)"
MNT="${MNT:-/tmp/ci-mount}"
gcc -Wall -o "$HERE/cifs" "$HERE/cifs.c" $(pkg-config fuse3 --cflags --libs)
mkdir -p "$MNT"
"$HERE/cifs" "$SRC" "$MNT" -o allow_other,default_permissions
cd "$MNT"
[ -d node_modules ] || npm install
./node_modules/.bin/next dev --turbopack -p 3005
