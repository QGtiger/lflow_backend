FROM node:18.0-alpine3.14 AS base

RUN npm install -g pnpm@8.12.1

FROM base AS build-stage

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile && pnpm run build

# production stage
FROM base AS production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/pnpm-lock.yaml /app/pnpm-lock.yaml

WORKDIR /app

RUN pnpm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
