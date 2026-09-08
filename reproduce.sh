#!/usr/bin/env bash
# Reproduces https://github.com/vercel/next.js/issues/98381 without Docker by
# placing `next dev` into a cgroup v2 memory-limited group (default 512 MB).
#
# Requires: Linux with cgroup v2 and write access to the cgroup hierarchy
# (any container/VM where you can `mkdir /sys/fs/cgroup/<name>`), Node >= 20.
#
# Equivalent Docker form (from the original report):
#   docker run --rm -m 2g node:22 ... npx next dev
set -u

LIMIT_BYTES="${LIMIT_BYTES:-536870912}" # 512 MB
CG=/sys/fs/cgroup/next-dev-repro
LOG="${LOG:-/tmp/next-dev-repro.log}"

setup_cgroup() {
  # the memory controller can only be enabled on the root cgroup when no
  # process sits directly in it, so park everything in a holder group first
  mkdir -p /sys/fs/cgroup/holder
  for p in $(cat /sys/fs/cgroup/cgroup.procs 2>/dev/null); do
    echo "$p" > /sys/fs/cgroup/holder/cgroup.procs 2>/dev/null
  done
  grep -q memory /sys/fs/cgroup/cgroup.subtree_control ||
    echo "+memory" > /sys/fs/cgroup/cgroup.subtree_control
  mkdir -p "$CG"
  echo "$LIMIT_BYTES" > "$CG/memory.max"
}

setup_cgroup || { echo "could not set up cgroup"; exit 1; }

echo "$$" > "$CG/cgroup.procs"
echo "--- cgroup of this shell: $(cat /proc/self/cgroup), memory.max: $(cat $CG/memory.max) ---"

echo
echo '--- what Node sees inside the memory-limited cgroup ---'
node -e '
  const os = require("os"), v8 = require("v8");
  const mb = (b) => Math.floor(b / 1048576);
  console.log("os.totalmem              ", mb(os.totalmem()), "MB");
  console.log("process.constrainedMemory", mb(process.constrainedMemory()), "MB");
  console.log("node default heap limit  ", mb(v8.getHeapStatistics().heap_size_limit), "MB");
  console.log("what next dev configures ", Math.floor(mb(os.totalmem()) * 0.5), "MB");
'

echo
echo "--- next $(node -p "require('next/package.json').version") dev ---"
npx next dev > "$LOG" 2>&1 &
DEV_PID=$!
for _ in $(seq 1 40); do grep -q "Ready in" "$LOG" && break; sleep 1; done
head -5 "$LOG"

echo
echo '--- NODE_OPTIONS of the forked dev server process ---'
found=0
for p in /proc/[0-9]*; do
  opts=$(tr '\0' '\n' < "$p/environ" 2>/dev/null | grep '^NODE_OPTIONS=.*max-old-space-size')
  if [ -n "$opts" ]; then echo "pid ${p#/proc/}: $opts"; found=1; fi
done
[ "$found" -eq 0 ] && echo '(no process found with max-old-space-size)'

echo
echo '--- heap limit actually in effect inside the dev server ---'
curl -s http://localhost:3000/api/mem; echo

kill "$DEV_PID" 2>/dev/null
wait "$DEV_PID" 2>/dev/null
exit 0
