FROM node:current-alpine3.15 AS base
WORKDIR /base
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS build
ARG NEXT_BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$NEXT_BUILD_DATE
ARG NEXT_PUBLIC_GRAPHQL_HTTP
ENV NEXT_PUBLIC_GRAPHQL_HTTP=$NEXT_PUBLIC_GRAPHQL_HTTP
ARG NEXT_PUBLIC_GRAPHQL_WS
ENV NEXT_PUBLIC_GRAPHQL_WS=$NEXT_PUBLIC_GRAPHQL_WS
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

FROM node:current-alpine3.15 AS production
SHELL ["/bin/sh", "-c"]
RUN apk add --no-cache bash
ARG user=joker
ARG home=/home/node
ARG group=thejokers
RUN addgroup -S $group
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home $home \
    --ingroup $group \
    $user

ENV NODE_ENV=production
WORKDIR $home
COPY --from=build --chown=55:$group /build/next.config.js ./
COPY --from=build --chown=55:$group /build/package*.json ./
COPY --from=build --chown=55:$group /build/.next ./.next
COPY --from=build --chown=55:$group /build/public ./public
RUN npm install next
USER $user

CMD npm run start