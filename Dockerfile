# develop stage
FROM node:16.16.0-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .

# build stage
FROM develop-stage as build-stage
COPY .env.dev .env
RUN yarn
RUN yarn add dotenv
RUN yarn add vuex@next --save
RUN yarn add vuex-persist
RUN yarn quasar build

# production stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/deployment/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
