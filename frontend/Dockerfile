FROM node:16.9-alpine3.11 as builder

WORKDIR /app

COPY . ./

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./

RUN yarn install


FROM node:lts

WORKDIR /app

COPY --from=builder /app  .

ENV HOST 0.0.0.0
EXPOSE 1234

CMD ["yarn", "dev"]
