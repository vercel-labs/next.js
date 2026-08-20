#!/usr/bin/env bash
# Usage: ./poll.sh http://localhost:3000 [iterations]
U=${1:-http://localhost:3000}; N=${2:-12}
for i in $(seq 1 $N); do
  curl -s -D /tmp/h.txt "$U" -o /tmp/b.html
  echo "t=$((i*5))s ts=$(grep -o '[0-9]\{4\}-[0-9][0-9]-[0-9][0-9]T[0-9:.]*Z' /tmp/b.html | head -1) $(grep -i -E 'x-vercel-cache|^age:' /tmp/h.txt | tr -d '\r' | paste -sd' ')"
  sleep 5
done
