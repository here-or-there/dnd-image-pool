# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.18.0

FROM node:${NODE_VERSION}-slim as base
ARG PORT
ENV PORT ${PORT}
ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY  package.json yarn.lock ./
COPY  prisma ./prisma/

RUN apt-get update && apt-get install -y openssl
RUN yarn install --production=false
#RUN npm install --production=false

COPY . .
RUN yarn build

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]