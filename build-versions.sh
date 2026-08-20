#!/usr/bin/env bash
# Builds two "deployments" of the same app:
#   .next-v1  -> what the user's browser tab loaded
#   .next-v2  -> what the server serves after the redeploy
# The only difference in v2 is that the client component module lives at a new path
# (app/Client.js -> app/ClientRenamed.js). Any real code change can do this: it shifts
# webpack's deterministic module id for that client component while its *chunk id*
# ("931" for app/page) stays the same.
set -e
cd "$(dirname "$0")"
mkdir -p logs
rm -rf .next .next-v1 .next-v2
npx next build > logs/build-v1.log 2>&1
cp -r .next .next-v1
mv app/Client.js app/ClientRenamed.js
sed -i 's#"./Client"#"./ClientRenamed"#' app/page.js
sed -i 's#>Demo<#>Demo v2<#' app/page.js
npx next build > logs/build-v2.log 2>&1
cp -r .next .next-v2
# restore sources to the v1 state
mv app/ClientRenamed.js app/Client.js
sed -i 's#"./ClientRenamed"#"./Client"#' app/page.js
sed -i 's#>Demo v2<#>Demo<#' app/page.js
echo "built .next-v1 and .next-v2"
