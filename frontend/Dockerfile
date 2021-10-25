FROM node:16.9-alpine3.11

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./

RUN apk --no-cache --virtual build-dependencies add \
        python \
        make \
        g++

RUN yarn install

COPY . ./

EXPOSE 1234

CMD ["yarn", "dev"]