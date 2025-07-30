FROM node:22-slim AS builder
WORKDIR /app

# install build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      python3 \
      ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-slim
WORKDIR /app

# application bundle
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

# copy the ephemeris data into the runtime image
COPY --from=builder /app/src/lib/vendor/ephemeris src/lib/vendor/ephemeris/

EXPOSE 3000
ENV NODE_ENV=production

CMD [ "node", "build" ]
