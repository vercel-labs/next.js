# Permutation with WORKDIR (slow build traces). Remove the WORKDIR line to get
# the fast permutation; see README.md.
FROM node:22-slim
WORKDIR /app
RUN npm i -g pnpm@10
COPY package.json .
RUN pnpm install --prod
COPY src src
WORKDIR /app/src
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build
