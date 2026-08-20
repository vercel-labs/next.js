#!/usr/bin/env bash
# Usage: NEXT_VERSION=canary ./verify.sh   (also try 14.0.4 / 15.5.4)
set -e
PORT=${PORT:-3000}
npm i next@${NEXT_VERSION:-canary} --silent
npm run build
npx next start -p $PORT > next-server.log 2>&1 &
sleep 8
g(){ curl -s -H "Host: $1" http://localhost:$PORT/test | grep -o 'time: [0-9]*' | head -1; }
echo "populate: test1=$(g test1.local) test2=$(g test2.local)"
curl -s -o /dev/null -X POST http://localhost:$PORT/api/revalidate   # revalidatePath('/test2.local/test')
echo "after revalidatePath('/test2.local/test'): test1=$(g test1.local) test2=$(g test2.local)"
curl -s -o /dev/null -X POST http://localhost:$PORT/api/revalidate2  # revalidatePath('/test')
echo "after revalidatePath('/test'):             test1=$(g test1.local) test2=$(g test2.local)"
kill %1
