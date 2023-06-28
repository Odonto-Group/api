FROM node:16 as builder

ADD . /app
WORKDIR /app

RUN yarn install --non-interactive \
&&  node ace build --production --ignore-ts-errors

FROM node:16

WORKDIR /app

COPY --from=builder /app/build /app
COPY --from=builder /app/.env.example /app/.env

RUN yarn install --production

CMD [ "node", "server.js" ]