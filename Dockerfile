# Mirrors the reporter's node:22-alpine multi-stage build, parameterised by Next version.
ARG NODE_IMAGE=node:22-alpine
FROM ${NODE_IMAGE} AS build
ARG NEXT_VERSION=15.2.4
ARG SCALE=0
WORKDIR /app
COPY app/package.json ./package.json
RUN npm pkg set dependencies.next=$NEXT_VERSION devDependencies.eslint-config-next=$NEXT_VERSION \
 && npm install --no-audit --no-fund
COPY app/ ./
COPY gen.sh /gen.sh
RUN if [ "$SCALE" = "1" ]; then sh -c 'apk add --no-cache bash >/dev/null && bash /gen.sh .'; fi
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production
RUN time npx next build
