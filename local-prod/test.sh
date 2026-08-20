#!/bin/bash
# 1) npm install && node backend.js &   (mutable backend on :3001, value read from /tmp/value.txt)
# 2) echo A > /tmp/value.txt && npx next build && npx next start &
# 3) ./test.sh  -> flips the backend value and polls the ISR page for 24s
val() { curl -s -D /tmp/hh http://localhost:3000/ | grep -o 'id="value">value: <!-- -->[A-Za-z]*' | sed 's/.*-->//'; }
echo "initial: $(val) $(grep -i '^x-nextjs-cache' /tmp/hh | tr -d '\r')"
echo Z > /tmp/value.txt; echo "backend switched to Z at $(date -u +%T)"
for i in $(seq 1 12); do sleep 2; echo "t+$((i*2))s page=$(val) $(grep -i '^x-nextjs-cache' /tmp/hh|tr -d '\r')"; done
