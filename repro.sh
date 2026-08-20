#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/74061
# Must be run as a NON-root user that has no passwordless sudo (e.g. CI container user,
# Codespace/devbox user, corporate laptop without admin rights).
set -u
PORT="${PORT:-3100}"
rm -rf certificates
mkdir -p logs
echo "== running: next dev --experimental-https (user: $(id -un)) =="
( npx next dev --experimental-https --port "$PORT" > logs/next-dev.log 2>&1 & echo $! > logs/pid )
sleep 25
cat logs/next-dev.log
echo "== probing the dev server =="
echo -n "http  -> "; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:$PORT/"
echo -n "https -> "; curl -sk -o /dev/null -w "%{http_code}\n" "https://localhost:$PORT/"
kill "$(cat logs/pid)" 2>/dev/null
echo
echo "== mkcert WITHOUT -install (no privileges needed) =="
MKCERT=$(ls "$HOME"/.cache/mkcert/mkcert-* 2>/dev/null | head -1)
if [ -n "$MKCERT" ]; then
  mkdir -p unprivileged-certs
  "$MKCERT" -key-file unprivileged-certs/key.pem -cert-file unprivileged-certs/cert.pem localhost 127.0.0.1 ::1
  echo "exit=$?"
fi
