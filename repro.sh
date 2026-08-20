#!/bin/bash
# build + start + probe; prints status lines
set -e
rm -f /tmp/notfound-flag
npm run build
npx next start -p 3000 > /tmp/next-repro.log 2>&1 &
SRV=$!
trap 'kill $SRV' EXIT
sleep 5
probe(){ curl -s -o /dev/null -D - http://localhost:3000/blog/1 | grep -Ei '^(HTTP/|x-nextjs-cache)' | tr -d '\r' | tr '\n' ' '; echo; }
echo -n "before flag: "; probe
curl -s 'http://localhost:3000/api/flag?on=1' > /dev/null
echo "flag on -> getStaticProps now returns notFound: true"
for i in 1 2 3 4 5 6; do sleep 2; echo -n "after flag req $i: "; probe; done
echo "--- getStaticProps calls in server log:"; grep getStaticProps /tmp/next-repro.log | tail -5
echo "--- prerendered file (should be gone/updated):"; ls -l .next/server/pages/blog/1.html
