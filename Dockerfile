FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

RUN mkdir -p /app
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package.json ./dist/
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV prod
EXPOSE 3000
CMD ["node", "dist/main"]
