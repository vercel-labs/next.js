# Reproduction for https://github.com/vercel/next.js/issues/96957
# Debian 10 (buster) ships glibc 2.28-10+deb10u3 -- the same glibc as RHEL 8.
# @next/swc-linux-x64-gnu requires GLIBC_2.29/2.30, so the native binding fails
# to load, only the WASM fallback loads, and `next build` (Turbopack) hard-fails.
FROM debian:10

RUN apt-get update && apt-get install -y curl ca-certificates xz-utils && \
    curl -fsSL -o /tmp/node.tar.xz https://nodejs.org/dist/v20.19.5/node-v20.19.5-linux-x64.tar.xz && \
    tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1

WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --fund=false
COPY app ./app

# Fails: "Turbopack is not supported on this platform (linux/x64)..."
CMD ["npx", "next", "build"]
