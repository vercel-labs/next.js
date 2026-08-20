#!/bin/bash
# One-shot reproduction: build, start, hit /a, revalidateTag, hit /a again.
set -u
node time-server.mjs & TIME_PID=$!
sleep 1
npx next build
npx next start -p 3000 > next-start.log 2>&1 & NEXT_PID=$!
sleep 6
echo "before revalidate  /a -> $(curl -s -m 20 -o /tmp/before.html -w '%{http_code}' http://localhost:3000/a)"
curl -s -m 15 -o /dev/null -w 'revalidateTag        -> %{http_code}\n' http://localhost:3000/api/revalidate
sleep 1
echo "after  revalidate  /a -> $(curl -s -m 25 -o /tmp/after.html -w '%{http_code}' http://localhost:3000/a)"
echo "after  revalidate  /  -> $(curl -s -m 25 -o /dev/null -w '%{http_code}' http://localhost:3000/)"
echo "--- next start log ---"; cat next-start.log
kill $NEXT_PID $TIME_PID 2>/dev/null
