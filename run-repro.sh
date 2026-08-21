#!/bin/bash
# Reproduction for https://github.com/vercel/next.js/issues/85071
#
# Simulates a corporate firewall / TLS-intercepting proxy inside a private
# mount namespace (Linux, needs root for `unshare -m`):
#   * /etc/hosts is overridden so registry.npmjs.org resolves to 127.0.0.1
#   * a local HTTPS server on :443 answers every request with an HTML block
#     page and HTTP 200, so `res.ok` is true in Next.js' getVersionInfo()
#   * .npmrc points at a different registry, which Next.js never consults
#
# Expected: no error, or the npmrc registry is used.
# Actual:   `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
#           is printed by `next dev`.
set -u
cd "$(dirname "$0")"
LOGDIR="${LOGDIR:-./logs}"
PW_OUT="${PW_OUT:-./logs}"
mkdir -p "$LOGDIR" "$PW_OUT"
export LOGDIR PW_OUT

# self-signed cert for the intercepting host (stands in for a corporate MITM CA)
[ -f cert.pem ] || openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem \
  -out cert.pem -days 365 -subj "/CN=registry.npmjs.org" \
  -addext "subjectAltName=DNS:registry.npmjs.org" >/dev/null 2>&1
cp /etc/hosts hosts.repro
echo "127.0.0.1 registry.npmjs.org" >> hosts.repro

unshare -m bash -c '
  set -u
  mount --bind ./hosts.repro /etc/hosts
  node firewall-proxy.mjs > "$LOGDIR/firewall.log" 2>&1 &
  FW=$!
  sleep 1
  NODE_EXTRA_CA_CERTS=./cert.pem NODE_TLS_REJECT_UNAUTHORIZED=0 \
    ./node_modules/.bin/next dev --port 3000 > "$LOGDIR/next-dev.log" 2>&1 &
  NEXT=$!
  for i in $(seq 1 40); do
    sleep 1
    curl -s -o /dev/null http://127.0.0.1:3000/ && break
  done
  # open a browser so the HMR client connects: in Next.js >= 16 the version
  # check is kicked off lazily on the first HMR "sync" event
  node browser-check.mjs || true
  kill $NEXT $FW 2>/dev/null
  wait 2>/dev/null
'
echo "--- next-dev.log ---"; cat "$LOGDIR/next-dev.log"
echo "--- firewall.log ---"; cat "$LOGDIR/firewall.log"
