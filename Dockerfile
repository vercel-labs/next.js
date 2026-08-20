# Real-world path reported in the issue: build/install on glibc, run on alpine
# (or install without musl optional deps) -> sharp cannot load -> next/image
# serves the unresized original in production.
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --no-optional
COPY . .
RUN npx next build
RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
CMD ["node", ".next/standalone/server.js"]
