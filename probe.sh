#!/usr/bin/env bash
# Probes every external-rewrite response shape against the running server.
# Usage: BASE=http://127.0.0.1:3002 bash probe.sh
BASE=${BASE:-http://127.0.0.1:3002}
paths=(
  /local/gzip /local/gzip-chunked /local/br /local/plain /local/bad-length
  /local/close /local/redirect /local/double-slash
  /js/plausible.js
  "/js/script.file-downloads.hash.outbound-links.tagged-events.js"
  /mw/plausible.js /mw/local.js
)
for p in "${paths[@]}"; do
  for ae in 'gzip, br, zstd' 'identity'; do
    printf '%-70s [%-14s] -> ' "$p" "$ae"
    curl -sSk -o /dev/null --max-time 20 \
      -w '%{http_code} http=%{http_version} size=%{size_download} enc=%header{content-encoding}\n' \
      -H "Accept-Encoding: $ae" "$BASE$p"
  done
done
