#!/usr/bin/env bash
# Local simulation of a standard Vercel build (NOW_BUILDER=1 => hasNextSupport),
# which auto-enables experimental.runtimeServerDeploymentId, then serves with and
# without NEXT_DEPLOYMENT_ID in the runtime environment.
set -u
DPL=dpl_test123456
npm install --no-audit --fund=false >/dev/null

echo "### build (NOW_BUILDER=1, NEXT_DEPLOYMENT_ID=$DPL)"
NOW_BUILDER=1 NEXT_DEPLOYMENT_ID=$DPL VERCEL_DEPLOYMENT_ID=$DPL npx next build >/tmp/build.log 2>&1 || { tail -30 /tmp/build.log; exit 1; }
node -e 'const c=require("./.next/required-server-files.json").config;console.log("required-server-files config: deploymentId=%j runtimeServerDeploymentId=%j",c.deploymentId,c.experimental.runtimeServerDeploymentId)'
echo "client-reference-manifest suffix code:"; tail -c 130 ".next/server/app/dyn/page_client-reference-manifest.js"

run() { # $1 = label, $2 = port, rest: env
  echo; echo "### next start $1"
  eval "$3 npx next start -p $2" >/tmp/start-$2.log 2>&1 &
  SRV=$!
  sleep 8
  for p in / /dyn /edge; do
    printf '%s -> ' "$p"; curl -s "localhost:$2$p" | grep -o 'dpl=[A-Za-z0-9_]*' | sort | uniq -c | tr '\n' ' '; echo
  done
  printf '/dyn duplicate refs to the same chunk: '
  curl -s "localhost:$2/dyn" | grep -o '/_next/static/chunks/[A-Za-z0-9_.~-]*\.js[?dpl=A-Za-z0-9_]*' | sort | uniq -c | sort -rn | head -4 | tr '\n' ' '; echo
  kill $SRV >/dev/null 2>&1
  sleep 1
}

run "WITH runtime NEXT_DEPLOYMENT_ID (matches Vercel today: all correct)" 3205 "NEXT_DEPLOYMENT_ID=$DPL"
run "WITHOUT runtime NEXT_DEPLOYMENT_ID (dynamic routes lose/mismatch the suffix)" 3206 ""
