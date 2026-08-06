#!/usr/bin/env bash
# Reproduces: build tracing globs the whole user profile when a dependency
# resolves a home-rooted dynamic path, and the walk's errors fail `next build`.
#
#   ./repro.sh            # uses whatever `next` version package.json pins
#
# Layout created (mirrors D:\a\<project> + C:\Users\<user> on windows-latest):
#   $ROOT/app   <- the Next.js project (outputFileTracingRoot = $ROOT)
#   $ROOT/home  <- fake user profile ($HOME) with an unreadable dir + a
#                  symlink cycle, standing in for the Windows junction loops
set -u
ROOT="${ROOT:-/tmp/nft-home-glob-repro}"
SRC="$(cd "$(dirname "$0")" && pwd)"

rm -rf "$ROOT"
mkdir -p "$ROOT/app" "$ROOT/home/plugins" "$ROOT/home/.cache/protected"
cp -r "$SRC"/app "$SRC"/packages "$SRC"/package.json "$SRC"/next.config.js "$ROOT/app/"
echo "module.exports = 1" > "$ROOT/home/plugins/a.js"
echo "module.exports = 'user profile file that must never be traced'" > "$ROOT/home/.cache/protected/secret.js"
ln -sfn "$ROOT/home" "$ROOT/home/.cache/loop"   # junction cycle stand-in

cd "$ROOT/app"
npm install --no-audit --no-fund

# Make one directory of the fake profile unreadable, like the access-denied
# junctions under C:\Users\<user>\AppData\Local. Requires a non-root builder.
if [ "$(id -u)" = "0" ]; then
  id -u builder >/dev/null 2>&1 || useradd -m builder
  chown -R builder:builder "$ROOT"
  chown root:root "$ROOT/home/.cache/protected"; chmod 000 "$ROOT/home/.cache/protected"
  RUN="su builder -c"
else
  chmod 000 "$ROOT/home/.cache/protected"
  RUN="bash -c"
fi

echo "--- path.relative guard on Windows (why this only bites win32) ---"
node "$SRC/win32-guard.js"

echo "--- next build --webpack ---"
$RUN "cd $ROOT/app && HOME=$ROOT/home NEXT_TELEMETRY_DISABLED=1 npx next build --webpack"
status=$?
echo "next build exited with $status"

echo "--- user-profile files copied into the standalone output ---"
find "$ROOT/app/.next/standalone" -path '*/home/*' 2>/dev/null | head -20
exit $status
