#!/bin/sh
# serve the *same* .next artifact under "deployment B"
# NEXT_PRIVATE_MINIMAL_MODE=1 mirrors how Vercel invokes the built server
set -e
NEXT_PRIVATE_MINIMAL_MODE=1 \
NEXT_DEPLOYMENT_ID=dpl_BBBBBBBBBBBBBBBBBBBBBBBB \
PORT=3001 npx next start
