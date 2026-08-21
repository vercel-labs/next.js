#!/usr/bin/env bash
P=${1:-3000}; U=http://localhost:$P/
c() { printf '%-42s %s\n' "$1" "$(curl -s -o /dev/null -w '%{http_code}' "${@:2}" "$U")"; }
c "GET"                         -X GET
c "POST (no body)"              -X POST
c "POST application/json"       -X POST -H 'content-type: application/json' -d '{}'
c "POST x-www-form-urlencoded"  -X POST -d 'a=1'
c "POST multipart/form-data"    -X POST -F 'payload={"a":1}'
c "PATCH"                       -X PATCH
c "DELETE"                      -X DELETE
