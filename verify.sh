#!/usr/bin/env bash
# Run with the dev server already running on :3000
set -u
probe() { echo "--- $1"; curl -s -o /tmp/p.html -w "status=%{http_code} " "http://localhost:3000$1"; grep -oE 'id="[a-z0-9-]+"' /tmp/p.html | sort -u | tr '\n' ' '; echo; }
probe /
probe /photo/1
probe /about
probe /reviews
