FROM node:16 as builder

ADD . /app
WORKDIR /app

RUN yarn install --non-interactive \
&&  node ace build --production --ignore-ts-errors

FROM node:16

COPY --from=builder /app/build /app
# NPM não efetua copia do diretorio email para build
COPY --from=builder /app/email /app/email
COPY --from=builder /app/.env.dev /app/.env

WORKDIR /app

RUN yarn install --production --non-interactive

CMD [ "node", "server.js" ]