#!/usr/bin/env bash
# Docker-less variant of this reproduction (this is the exact path that was verified).
# Downloads the debian:10 image rootfs from Docker Hub, extracts it, installs Node 20,
# and runs `next build` inside a chroot on a glibc 2.28 userland.
set -euo pipefail
ROOT=${ROOT:-/tmp/deb10root}
TOKEN=$(curl -s "https://auth.docker.io/token?service=registry.docker.io&scope=repository:library/debian:pull" | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
MAN=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.docker.distribution.manifest.v2+json" \
  https://registry-1.docker.io/v2/library/debian/manifests/sha256:2a0c1b9175adf759420fe0fbd7f5b449038319171eb76554bb76cbe172b62b42)
LAYER=$(printf '%s' "$MAN" | python3 -c "import sys,json;print(json.load(sys.stdin)['layers'][0]['digest'])")
curl -sL -H "Authorization: Bearer $TOKEN" -o /tmp/deb10.tar.gz "https://registry-1.docker.io/v2/library/debian/blobs/$LAYER"
sudo mkdir -p "$ROOT" && sudo tar -xzf /tmp/deb10.tar.gz -C "$ROOT"
curl -sL -o /tmp/node20.tar.xz https://nodejs.org/dist/v20.19.5/node-v20.19.5-linux-x64.tar.xz
sudo tar -xJf /tmp/node20.tar.xz -C "$ROOT/usr/local" --strip-components=1
sudo cp /etc/resolv.conf "$ROOT/etc/resolv.conf"
sudo mount -t proc proc "$ROOT/proc" || true
sudo mkdir -p "$ROOT/app" && sudo cp -r package.json app "$ROOT/app/"
sudo chroot "$ROOT" /bin/bash -c "ldd --version | head -1; cd /app && npm install --no-audit --fund=false >/dev/null && npx next build"
