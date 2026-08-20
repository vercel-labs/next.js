#!/usr/bin/env bash
# Reproduction for https://github.com/vercel/next.js/issues/71827
# Requires: docker (with buildx). Spins up a local private npm registry (verdaccio),
# publishes @repro/private-lib to it, then builds this app with the canary
# examples/with-docker Dockerfile.
set -u

echo "== starting local private registry (verdaccio) =="
docker rm -f repro-verdaccio >/dev/null 2>&1
docker run -d --name repro-verdaccio -p 4873:4873 verdaccio/verdaccio:6 >/dev/null
for i in $(seq 1 60); do curl -sf http://127.0.0.1:4873/ >/dev/null && break; sleep 1; done

echo "== publishing @repro/private-lib to the private registry =="
node -e "
const http=require('http');
const d=JSON.stringify({name:'repro',password:'repro123',email:'r@r.dev',type:'user'});
const q=http.request({host:'127.0.0.1',port:4873,path:'/-/user/org.couchdb.user:repro',method:'PUT',headers:{'content-type':'application/json','content-length':d.length}},r=>r.resume());
q.end(d);"
sleep 2
( cd private-lib \
  && echo "//127.0.0.1:4873/:_auth=$(printf 'repro:repro123' | base64)" > .npmrc \
  && npm publish --registry http://127.0.0.1:4873 >/dev/null 2>&1; echo "published" )

build() {
  echo
  echo "############ docker buildx build -f $1 ############"
  docker buildx build --add-host host.docker.internal:host-gateway --progress plain -f "$1" -t "repro:$2" . 2>&1 | tail -n 40
  echo "--> exit: ${PIPESTATUS[0]}"
}

# 1. canary examples/with-docker Dockerfile  -> FAILS
build Dockerfile canary
# 2. same, with the Yarn Berry CLI flags fixed -> still FAILS, 404 on the private
#    package because .yarnrc.yml (registry config) was never copied
build Dockerfile.flags-fixed flags-fixed
# 3. .yarnrc*/.yarnrc.yml* added to the COPY line -> SUCCEEDS
build Dockerfile.fixed fixed
