FROM node:16-slim as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build src/index.html --public-url ./

FROM nginx:1.21.3
COPY --from=builder /app/dist /usr/share/nginx/html