FROM node:current-alpine3.15 AS base
WORKDIR /base
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS build

ARG NEXT_BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$NEXT_BUILD_DATE

ARG NEXT_CONTENT_GRAPHQL
ENV NEXT_CONTENT_GRAPHQL=$NEXT_CONTENT_GRAPHQL

ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

FROM node:current-alpine3.15 AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/next.config.js ./
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
RUN npm install next

CMD npm run start