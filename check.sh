#!/bin/bash
# Starts the dev server and prints the response headers + body size for "/".
set -e
npm install
(npm run dev > dev.log 2>&1 &)
sleep 25
curl -s -D- http://localhost:3000/ -o body.html
echo "body bytes: $(wc -c < body.html)"
