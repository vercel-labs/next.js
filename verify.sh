#!/usr/bin/env bash
# Usage: ./verify.sh <base-url>   e.g. ./verify.sh https://my-repro.vercel.app
set -e
B="${1:-http://localhost:3000}"
v(){ curl -s "$B$1" | grep -o 'id="t">[^<]*\(<!-- -->[^<]*\)*' | grep -o '[0-9]\{10,\}' | head -1; }
echo "baseline           /time/          = $(v /time/)"
echo "baseline           /blog/prebuilt/ = $(v /blog/prebuilt/)"
curl -s "$B/api/revalidate/?path=/time/" ; echo
sleep 5; echo "after revalidatePath('/time/')          /time/          = $(v /time/)"
curl -s "$B/api/revalidate/?path=/blog/prebuilt/" ; echo
sleep 5; echo "after revalidatePath('/blog/prebuilt/') /blog/prebuilt/ = $(v /blog/prebuilt/)"
echo "PASS = timestamps changed. FAIL = timestamps unchanged (issue #59836)."
