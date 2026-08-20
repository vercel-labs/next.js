#!/bin/bash
# usage: ./check.sh https://your-deployment.vercel.app
B=$1
for p in /api/node-static /api/node-dynamic/abc /api/node-buffer/abc /api/node-slow/abc /api/node-large/abc /api/node-notype/abc /api/edge-static /api/edge-dynamic/abc /api/edge-buffer/abc /api/edge-slow/abc /api/edge-large/abc /api/edge-notype/abc /api/edge-copyheaders/abc; do
  enc=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$p")
  d=$(curl -s -o /dev/null -w "%{http_code} %{content_type}" "$B$p")
  o=$(curl -s -o /dev/null -w "%{http_code} %{content_type}" "$B/_next/image?url=$enc&w=256&q=75")
  printf "%-28s direct=[%s] optimized=[%s]\n" "$p" "$d" "$o"
done
