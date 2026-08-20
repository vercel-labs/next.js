#!/bin/bash
show() { echo "$(curl -s localhost:3000/a | grep -o 'A:[0-9]*' | head -1)  $(curl -s localhost:3000/b | grep -o 'B:[0-9]*' | head -1)"; }
for i in 1 2 3; do
 echo "=== round $i"; echo -n "before: "; show
 curl -s localhost:3000/api/revalidate-paths >/dev/null
 sleep 1; show >/dev/null; sleep 2
 echo -n "after:  "; show
done
