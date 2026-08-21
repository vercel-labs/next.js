#!/usr/bin/env bash
# Checks the Location header the Next.js server sends for a cross-host
# middleware redirect. No /etc/hosts entry required (curl --resolve is used).
set -u
echo "--- request to subdomain host (server started with --hostname example.test):"
curl -s -i --resolve foo.example.test:3000:127.0.0.1 \
  http://foo.example.test:3000/shouldredirect | grep -i '^location'
echo "expected: location: http://example.test:3000/login"
echo "actual  : location: /login   <-- bug: browser resolves it to http://foo.example.test:3000/login"
