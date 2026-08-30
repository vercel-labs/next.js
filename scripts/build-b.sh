#!/bin/sh
# control: build the artifact under the *same* deployment id it is served with
set -e
NEXT_DEPLOYMENT_ID=dpl_BBBBBBBBBBBBBBBBBBBBBBBB npx next build
