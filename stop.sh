#!/bin/bash
kill -- -$(cat /tmp/dev.pgid) 2>/dev/null
sleep 2
pgrep -af "port 3400" || echo "no 3400 procs"
