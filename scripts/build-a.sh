#!/bin/sh
# build the artifact under "deployment A"
set -e
NEXT_DEPLOYMENT_ID=dpl_AAAAAAAAAAAAAAAAAAAAAAAA npx next build
